import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "notion-new-database",
  name: "New Data Source Created",
  description: "Emit new event when a data source is created. [See the documentation](https://developers.notion.com/reference/data-source)",
  version: "0.1.1",
  type: "source",
  props: {
    ...base.props,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "Ensure Data Sources are shared with your Pipedream integration to receive events.",
    },
  },
  async run() {
    const dataSources = [];
    const params = this.lastCreatedSortParam();
    const lastCreatedTimestamp = this.getLastCreatedTimestamp();

    do {
      const response = await this.notion.listDataSources(params);

      for (const dataSource of response.results) {
        if (!this.isResultNew(dataSource.created_time, lastCreatedTimestamp)) {
          params.start_cursor = null;
          break;
        }
        dataSources.push(dataSource);
      }

      params.start_cursor = response.next_cursor;
    } while (params.start_cursor);

    dataSources.reverse().forEach((dataSource) => {
      const meta = this.generateMeta(
        dataSource,
        constants.types.DATA_SOURCE,
        constants.timestamps.CREATED_TIME,
        constants.summaries.DATA_SOURCE_ADDED,
      );
      this.$emit(dataSource, meta);
    });

    const lastCreatedTime = dataSources[dataSources.length - 1]?.created_time;
    if (lastCreatedTime) {
      this.setLastCreatedTimestamp(Date.parse(lastCreatedTime));
    }
  },
  sampleEmit,
};
