import notion from "../../notion.app.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-new-page",
  name: "New Page in Database",
  description: "Emit new event when a page in a database is created",
  version: "0.0.4",
  type: "source",
  props: {
    ...base.props,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
    },
  },
  async run() {
    const pages = [];
    const params = this.lastCreatedSortParam();
    const lastCreatedTimestamp = this.getLastCreatedTimestamp();

    // Get pages in created order descending until the first page edited after
    // lastCreatedTimestamp, then reverse list of pages and emit
    const pagesStream = this.notion.getPages(this.databaseId, params);

    for await (const page of pagesStream) {
      if (!this.isResultNew(page.created_time, lastCreatedTimestamp)) {
        break;
      }
      pages.push(page);
    }

    pages.reverse().forEach((page) => {
      const meta = this.generateMeta(
        page,
        constants.types.PAGE,
        constants.timestamps.CREATED_TIME,
        constants.summaries.PAGE_ADDED,
      );
      this.$emit(page, meta);
    });

    const lastCreatedTime = pages[pages.length - 1]?.created_time;
    if (lastCreatedTime) {
      this.setLastCreatedTimestamp(Date.parse(lastCreatedTime));
    }
  },
};
