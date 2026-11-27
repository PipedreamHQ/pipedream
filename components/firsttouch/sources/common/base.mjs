import firsttouch from "../../firsttouch.app.mjs";
import utils from "../../common/utils.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const MAX_SEEN = 2000;
const HISTORICAL_EVENTS = 10;
const MAX_PAGES = 10;

export default {
  props: {
    firsttouch,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSeenIds() {
      return this.db.get("seenIds") || [];
    },
    _setSeenIds(ids) {
      this.db.set("seenIds", ids.slice(0, MAX_SEEN));
    },
    daysAgoIso(days) {
      return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    },
    /**
     * Calls `fetchPage(cursor)` until it returns no next cursor (or MAX_PAGES is reached)
     * and returns every item. `fetchPage` resolves to `{ items, cursor }`.
     */
    async paginate(fetchPage) {
      const items = [];
      let cursor;
      for (let page = 0; page < MAX_PAGES; page++) {
        const result = await fetchPage(cursor);
        items.push(...(result.items || []));
        if (!result.cursor) break;
        cursor = result.cursor;
      }
      return items;
    },
    fetchEvents() {
      throw new Error("fetchEvents is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    emitEvent(event) {
      this.$emit(event.data, {
        id: event.id,
        summary: this.getSummary(event.data),
        ts: Date.parse(event.occurredAt) || Date.now(),
      });
    },
    async processEvents({ isDeploy = false } = {}) {
      const events = (await this.fetchEvents()).map((event) => ({
        ...event,
        id: utils.toEventId(event.id),
      }));
      const previous = this._getSeenIds();
      const seen = new Set(previous);
      const ordered = [
        ...events,
      ].sort((a, b) => String(a.occurredAt).localeCompare(String(b.occurredAt)));
      const toEmit = isDeploy
        ? ordered.slice(-HISTORICAL_EVENTS)
        : ordered.filter((event) => !seen.has(event.id));
      for (const event of toEmit) {
        this.emitEvent(event);
      }
      // Record IDs only after every event above was emitted, so a failed emit is retried next poll.
      const merged = [
        ...events.map((event) => event.id),
        ...previous,
      ];
      this._setSeenIds(merged.filter((id, index) => merged.indexOf(id) === index));
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents({
        isDeploy: true,
      });
    },
  },
  async run() {
    await this.processEvents();
  },
};
