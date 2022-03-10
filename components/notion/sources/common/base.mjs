import notion from "../../notion.app.mjs";
import constants from "./constants.mjs";

function lastSortParam(timestamp, params = {}) {
  return {
    ...params,
    sorts: [
      {
        timestamp,
        direction: constants.directions.DESCENDING,
      },
    ],
  };
}

export default {
  props: {
    notion,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    generateMeta(obj, type, timestamp, summary) {
      const {
        id,
        [timestamp]: lastTime,
      } = obj;
      const title = type === constants.types.DATABASE
        ? this.notion.extractDatabaseTitle(obj)
        : this.notion.extractPageTitle(obj);

      const ts = Date.parse(lastTime);
      const compositeId = `${id}-${ts}`;
      return {
        // Create composite ID so update events for the same page have unique keys
        // See https://pipedream.com/docs/components/api/#emit
        id: compositeId,
        summary: `${summary}: ${title} - ${id}`,
        ts,
      };
    },
    isResultNew(result, startTimestamp) {
      return Date.parse(result) > startTimestamp;
    },
    daysAgo(days) {
      return new Date().setDate(new Date().getDate() - days);
    },
    getLastCreatedTimestamp() {
      return this.db.get(constants.timestamps.CREATED_TIME) ?? this.daysAgo(7);
    },
    setLastCreatedTimestamp(ts) {
      this.db.set(constants.timestamps.CREATED_TIME, ts);
    },
    getLastUpdatedTimestamp() {
      return this.db.get(constants.timestamps.LAST_EDITED_TIME) ?? this.daysAgo(7);
    },
    setLastUpdatedTimestamp(ts) {
      this.db.set(constants.timestamps.LAST_EDITED_TIME, ts);
    },
    lastCreatedSortParam(params = {}) {
      return lastSortParam(constants.timestamps.CREATED_TIME, params);
    },
    lastUpdatedSortParam(params = {}) {
      return lastSortParam(constants.timestamps.LAST_EDITED_TIME, params);
    },
  },
};
