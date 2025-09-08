import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../sendcloud.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    setCheckpoint(key, value) {
      this.db.set(key, value);
    },
    getCheckpoint(key) {
      return this.db.get(key);
    },
    /**
     * Override this method to return true if your source needs date string conversion
     * @returns {boolean} Whether to use stringToDate conversion
     */
    shouldConvertDateString() {
      return false;
    },
    stringToDate(str) {
      const isoString = str.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}:\d{2}:\d{2})/, "$3-$2-$1T$4");
      return new Date(isoString);
    },
    /**
     * Converts a date string to a Date object, optionally using stringToDate conversion
     * @param {string} dateStr - The date string to convert
     * @returns {Date|null} The Date object or null if invalid
     */
    parseDate(dateStr) {
      if (!dateStr) {
        return null;
      }

      if (this.shouldConvertDateString()) {
        return this.stringToDate(dateStr);
      }

      return new Date(dateStr);
    },
    /**
     * Sorts items by timestamp in descending order (newest to oldest)
     * @param {Array} items - Array of items to sort
     * @param {Function} getTs - Function to extract timestamp from each item,
     *  defaults to date_updated or date_created
     * @returns {Array} Sorted array of items
     */
    getSortedItems(items = [], getTs = (r) => r?.updated_at || r?.created_at) {
      return Array.from(items).sort((a, b) => {
        const dateA = this.parseDate(getTs(a));
        const dateB = this.parseDate(getTs(b));
        return (dateB || 0) - (dateA || 0);
      });
    },
    emitNewItems({
      items = [], checkpointKey, getId, getTs, getSummary,
    }) {
      const last = this.getCheckpoint(checkpointKey);
      let newest = last
        ? new Date(last)
        : null;

      items.forEach((item) => {
        const tsStr = getTs(item);
        const ts = this.parseDate(tsStr);

        if (!ts || isNaN(ts.getTime())) {
          console.log("Timestamp is not a valid date", item);
          return;
        }

        const isNew = !last || ts >= new Date(last);

        if (!isNew) {
          console.log("Item is not new", item);
          return;
        }

        this.$emit(item, {
          id: getId(item, ts),
          summary: getSummary(item),
          ts: ts.getTime(),
        });

        if (!newest || ts < newest) {
          newest = ts;
        }
      });

      if (newest) {
        this.setCheckpoint(checkpointKey, newest.toISOString());
      }
    },
  },
};

