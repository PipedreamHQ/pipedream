import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-new-database",
  name: "New Database Created",
  description: "Emit new event when a database is created. [See the documentation](https://developers.notion.com/reference/database)",
  version: "0.0.11",
  type: "source",
  props: {
    ...base.props,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "Ensure Databases are shared with your Pipedream integration to receive events.",
    },
  },
  async run() {
    const databases = [];
    const params = this.lastCreatedSortParam();
    const lastCreatedTimestamp = this.getLastCreatedTimestamp();

    do {
      const response = await this.notion.listDatabases(params);

      for (const database of response.results) {
        if (!this.isResultNew(database.created_time, lastCreatedTimestamp)) {
          params.start_cursor = null;
          break;
        }
        databases.push(database);
      }

      params.start_cursor = response.next_cursor;
    } while (params.start_cursor);

    databases.reverse().forEach((database) => {
      const meta = this.generateMeta(
        database,
        constants.types.DATABASE,
        constants.timestamps.CREATED_TIME,
        constants.summaries.DATABASE_ADDED,
      );
      this.$emit(database, meta);
    });

    const lastCreatedTime = databases[databases.length - 1]?.created_time;
    if (lastCreatedTime) {
      this.setLastCreatedTimestamp(Date.parse(lastCreatedTime));
    }
  },
  sampleEmit,
};
