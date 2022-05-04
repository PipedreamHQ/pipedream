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
    generateMeta(obj, type, timestamp, summary, isUpdate = false) {
      let title;
      let {
        id,
        [timestamp]: lastTime,
      } = obj;
      const ts = Date.parse(lastTime);

      if (type === constants.types.DATABASE) {
        title = this.notion.extractDatabaseTitle(obj);
      } else {
        title = this.notion.extractPageTitle(obj);
        // Create composite ID so update events for the same page have unique keys
        // See https://pipedream.com/docs/components/api/#emit
        if (isUpdate) {
          id = `${id}-${ts}`;
        }
      }

      return {
        id,
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
