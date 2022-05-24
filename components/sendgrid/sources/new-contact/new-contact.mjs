import orderBy from "lodash/orderBy.js";
import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "sendgrid-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  hooks: {
    async activate() {
      const currentTimestamp = Date.now();
      const state = {
        processedItems: [],
        lowerTimestamp: currentTimestamp,
        upperTimestamp: currentTimestamp,
      };
      this.db.set("state", state);
    },
  },
  methods: {
    ...common.methods,
    _maxDelayTime() {
      // There is no report from SendGrid as to how much time it takes
      // for a contact to be created and appear in search results, so
      // we're using a rough estimate of 30 minutes here.
      return 30 * 60 * 1000;  // 30 minutes, in milliseconds
    },
    _addDelayOffset(timestamp) {
      return timestamp - this._maxDelayTime();
    },
    _cleanupOldProcessedItems(processedItems, currentTimestamp) {
      return processedItems
        .map((item) => ({
          // We just need to keep track of the record ID and
          // its creation date.
          id: item.id,
          created_at: item.created_at,
        }))
        .filter((item) => {
          const { created_at: createdAt } = item;
          const createdAtTimestamp = Date.parse(createdAt);
          const cutoffTimestamp = this._addDelayOffset(currentTimestamp);
          return createdAtTimestamp > cutoffTimestamp;
        });
    },
    _makeSearchQuery(processedItems, lowerTimestamp, upperTimestamp) {
      const idList = processedItems
        .map((item) => item.id)
        .map((id) => `'${id}'`)
        .join(", ")
      || "''";
      const startTimestamp = this._addDelayOffset(lowerTimestamp);
      const startDate = this.toISOString(startTimestamp);
      const endDate = this.toISOString(upperTimestamp);
      return `
        contact_id NOT IN (${idList}) AND
        created_at BETWEEN
          TIMESTAMP '${startDate}' AND
          TIMESTAMP '${endDate}'
      `;
    },
    generateMeta(data) {
      const {
        item,
        eventTimestamp: ts,
      } = data;
      const {
        id,
        email,
      } = item;
      const slugifiedEmail = this.slugifyEmail(email);
      const summary = `New contact: ${slugifiedEmail}`;
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(event) {
      // Transform the timer timestamp to milliseconds
      // to be consistent with how Javascript handles timestamps.
      const eventTimestamp = event.timestamp * 1000;

      // Retrieve the current state of the component.
      const {
        processedItems,
        lowerTimestamp,
        upperTimestamp,
      } = this.db.get("state");

      // Search for contacts within a specific timeframe, excluding
      // items that have already been processed.
      const query = this._makeSearchQuery(processedItems, lowerTimestamp, upperTimestamp);
      const {
        result: items,
        contact_count: contactCount,
      } = await this.sendgrid.searchContacts(query);

      // If no contacts have been retrieved via the API,
      // move the time window forward to possibly capture newer contacts.
      if (contactCount === 0) {
        const newState = {
          processedItems: this._cleanupOldProcessedItems(processedItems, lowerTimestamp),
          lowerTimestamp: upperTimestamp,
          upperTimestamp: eventTimestamp,
        };
        this.db.set("state", newState);
        return;
      }

      // We process the searched records from oldest to newest.
      const itemsToProcess = orderBy(items, "created_at");
      itemsToProcess
        .forEach((item) => {
          const meta = this.generateMeta({
            item,
            eventTimestamp,
          });
          this.$emit(item, meta);
        });

      // Use the timestamp of the last processed record as a lower bound for
      // following searches. This bound will be subjected to an offset so in
      // case older records appear in future search results, but have not
      // appeared until now, can be processed. We only adjust it if it means
      // moving forward, not backwards. Otherwise, we might start retrieving
      // older and older records indefinitely (and we're all about *new*
      // records!)
      const newLowerTimestamp = Math.max(
        lowerTimestamp,
        Date.parse(itemsToProcess[0].created_at),
      );

      // If the total contact count is less than 100, it means that during the
      // next iteration the search results count will most likely be less than
      // 50. In that case, if we extend the upper bound of the search time range
      // we might be able to retrieve more records.
      const newUpperTimestamp = contactCount < 100
        ? eventTimestamp
        : upperTimestamp;

      // The list of processed items can grow indefinitely.
      // Since we don't want to keep track of every processed record
      // ever, we need to clean up this list, removing any records
      // that are no longer relevant.
      const newProcessedItems = this._cleanupOldProcessedItems(
        [
          ...processedItems,
          ...itemsToProcess,
        ],
        newLowerTimestamp,
      );

      // Update the state of the component to reflect the computations
      // made above.
      const newState = {
        processedItems: newProcessedItems,
        lowerTimestamp: newLowerTimestamp,
        upperTimestamp: newUpperTimestamp,
      };
      this.db.set("state", newState);
    },
  },
};
