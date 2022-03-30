import notion from "../../notion.app.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-updated-page",
  name: "Updated Page", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a page is updated",
  version: "0.0.1",
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
    const params = this.lastUpdatedSortParam();
    const lastCheckedTimestamp = this.getLastUpdatedTimestamp();

    // Get pages in updated order descending until the first page edited after
    // lastEditedTime, then reverse list of pages and emit
    const pagesStream = this.notion.getPages(this.databaseId, params);

    for await (const page of pagesStream) {
      if (!this.isResultNew(page.last_edited_time, lastCheckedTimestamp)) {
        break;
      }
      pages.push(page);
    }

    pages.reverse().forEach((page) => {
      const meta = this.generateMeta(
        page,
        constants.types.PAGE,
        constants.timestamps.LAST_EDITED_TIME,
        constants.summaries.PAGE_UPDATED,
        true,
      );
      this.$emit(page, meta);
    });

    const lastPageEditedTime = pages[pages.length - 1]?.last_edited_time;
    if (lastPageEditedTime) {
      this.setLastUpdatedTimestamp(Date.parse(lastPageEditedTime));
    }
  },
};
