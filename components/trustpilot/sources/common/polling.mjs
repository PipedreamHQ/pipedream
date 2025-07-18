import trustpilot from "../../app/trustpilot.app.ts";
import {
  POLLING_CONFIG, SOURCE_TYPES,
} from "../../common/constants.mjs";

/**
 * Base polling source for Trustpilot integration
 *
 * This integration uses polling instead of webhooks for the following reasons:
 * 1. Better reliability - polling ensures no events are missed
 * 2. Simpler implementation - no need for webhook endpoint management
 * 3. Consistent data retrieval - can backfill historical data if needed
 * 4. Works with all authentication methods (API key and OAuth)
 *
 * All sources poll every 15 minutes by default and maintain deduplication
 * to ensure events are only emitted once.
 */
export default {
  props: {
    trustpilot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: POLLING_CONFIG.DEFAULT_TIMER_INTERVAL_SECONDS,
      },
    },
    businessUnitId: {
      propDefinition: [
        trustpilot,
        "businessUnitId",
      ],
      optional: true,
      description: "Business Unit ID to filter events for. If not provided, will receive events for all business units.",
    },
  },
  methods: {
    _getLastPolled() {
      return this.db.get("lastPolled");
    },
    _setLastPolled(timestamp) {
      this.db.set("lastPolled", timestamp);
    },
    _getSeenItems() {
      return this.db.get("seenItems") || {};
    },
    _setSeenItems(seenItems) {
      this.db.set("seenItems", seenItems);
    },
    _cleanupSeenItems(seenItems, hoursToKeep = 72) {
      const cutoff = Date.now() - (hoursToKeep * 60 * 60 * 1000);
      const cleaned = {};

      Object.entries(seenItems).forEach(([
        key,
        timestamp,
      ]) => {
        if (timestamp > cutoff) {
          cleaned[key] = timestamp;
        }
      });

      return cleaned;
    },
    getSourceType() {
      // Override in child classes
      return SOURCE_TYPES.NEW_REVIEWS;
    },
    getPollingMethod() {
      // Override in child classes to return the app method to call
      throw new Error("getPollingMethod must be implemented in child class");
    },
    getPollingParams() {
      // Override in child classes to return method-specific parameters
      return {
        businessUnitId: this.businessUnitId,
        limit: POLLING_CONFIG.MAX_ITEMS_PER_POLL,
        sortBy: "createdat.desc", // Most recent first
      };
    },
    isNewItem(item, sourceType) {
      // For "new" sources, check creation date
      // For "updated" sources, check update date
      const itemDate = sourceType.includes("updated")
        ? new Date(item.updatedAt)
        : new Date(item.createdAt || item.updatedAt);

      const lastPolled = this._getLastPolled();
      return !lastPolled || itemDate > new Date(lastPolled);
    },
    generateDedupeKey(item, sourceType) {
      // Create unique key: itemId + relevant timestamp
      const timestamp = sourceType.includes("updated")
        ? item.updatedAt
        : (item.createdAt || item.updatedAt);

      return `${item.id}_${timestamp}`;
    },
    generateMeta(item, sourceType) {
      const dedupeKey = this.generateDedupeKey(item, sourceType);
      const summary = this.generateSummary(item);
      const timestamp = sourceType.includes("updated")
        ? item.updatedAt
        : (item.createdAt || item.updatedAt);

      return {
        id: dedupeKey,
        summary,
        ts: new Date(timestamp).getTime(),
      };
    },
    generateSummary(item) {
      // Override in child classes for specific summaries
      return `${this.getSourceType()} - ${item.id}`;
    },
    async fetchItems() {
      const method = this.getPollingMethod();
      const params = this.getPollingParams();

      try {
        const result = await this.trustpilot[method](params);

        // Handle different response formats
        if (result.reviews) {
          return result.reviews;
        } else if (result.conversations) {
          return result.conversations;
        } else if (Array.isArray(result)) {
          return result;
        } else {
          return [];
        }
      } catch (error) {
        console.error(`Error fetching items with ${method}:`, error);
        throw error;
      }
    },
    async pollForItems() {
      const sourceType = this.getSourceType();
      const lastPolled = this._getLastPolled();
      const seenItems = this._getSeenItems();

      // If first run, look back 24 hours
      const lookbackMs = POLLING_CONFIG.LOOKBACK_HOURS * 60 * 60 * 1000;
      const since = lastPolled || new Date(Date.now() - lookbackMs).toISOString();

      console.log(`Polling for ${sourceType} since ${since}`);

      try {
        const items = await this.fetchItems(since);
        const newItems = [];
        const currentTime = Date.now();

        for (const item of items) {
          // Check if item is new based on source type
          if (this.isNewItem(item, sourceType)) {
            const dedupeKey = this.generateDedupeKey(item, sourceType);

            // Check if we've already seen this exact item+timestamp
            if (!seenItems[dedupeKey]) {
              seenItems[dedupeKey] = currentTime;
              newItems.push(item);
            }
          }
        }

        // Emit new items
        for (const item of newItems.reverse()) { // Oldest first
          const meta = this.generateMeta(item, sourceType);
          this.$emit(item, meta);
        }

        // Update state
        this._setLastPolled(new Date().toISOString());
        this._setSeenItems(this._cleanupSeenItems(seenItems));

        console.log(`Found ${newItems.length} new items of type ${sourceType}`);

      } catch (error) {
        console.error(`Polling failed for ${sourceType}:`, error);
        throw error;
      }
    },
  },
  async run() {
    await this.pollForItems();
  },
};
