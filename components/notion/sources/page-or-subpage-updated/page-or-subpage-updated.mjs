import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "notion-page-or-subpage-updated",
  name: "Page or Subpage Updated", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when the selected page or one of its sub-pages is updated. [See the documentation](https://developers.notion.com/reference/page)",
  version: "0.0.14",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "Ensure the selected page is shared with your Pipedream integration to receive events.",
    },
    pageId: {
      propDefinition: [
        base.props.notion,
        "pageId",
      ],
    },
  },
  methods: {
    ...base.methods,
    isRelevant(page) {
      return (page.id == this.pageId) || (page.parent?.page_id == this.pageId);
    },
    emitPage(page) {
      const meta = this.generateMeta(
        page,
        constants.types.PAGE,
        constants.timestamps.LAST_EDITED_TIME,
        constants.summaries.PAGE_UPDATED,
        true,
      );

      this.$emit(page, meta);
    },
  },
  async run() {
    const params = this.lastUpdatedSortParam();
    const lastCheckedTimestamp = this.getLastUpdatedTimestamp();
    let maxTimestamp = lastCheckedTimestamp;
    let hasMore = false;

    do {
      const {
        results: pages, next_cursor: next,
      } = await this.notion.search(undefined, params);
      hasMore = next
        ? true
        : false;
      params.next_cursor = next;

      for (const page of pages) {
        if (!this.isResultNew(page?.last_edited_time, lastCheckedTimestamp)) {
          hasMore = false;
          break;
        }

        if (this.isRelevant(page)) {
          this.emitPage(page);
        }

        if (this.isResultNew(page.last_edited_time, maxTimestamp)) {
          maxTimestamp = Date.parse(page.last_edited_time);
        }
      }
    } while (hasMore);
    this.setLastUpdatedTimestamp(maxTimestamp);
  },
  sampleEmit,
};
