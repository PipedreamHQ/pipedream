import notion from "../../notion.app.mjs";
import sampleEmit from "./test-event.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-new-page",
  name: "New Page in Database",
  description: "Emit new event when a page in a database is created",
  version: "0.0.9",
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
  hooks: {
    ...base.hooks,
    async deploy() {
      await this.processEvents(25);
    },
  },
  methods: {
    ...base.methods,
    async processEvents(max) {
      const pages = [];
      const lastCreatedTimestamp = this.getLastCreatedTimestamp();
      const lastCreatedTimestampDate = new Date(lastCreatedTimestamp);
      const lastCreatedTimestampISO = lastCreatedTimestampDate.toISOString();

      // Add a filter so that we only receive pages that have been created since the saved time.
      const params = {
        ...this.lastCreatedSortParam(),
        filter: {
          timestamp: "created_time",
          created_time: {
            after: lastCreatedTimestampISO,
          },
        },
      };

      // Get pages in created order descending until the first page edited after
      // lastCreatedTimestamp, then reverse list of pages and emit
      const pagesStream = this.notion.getPages(this.databaseId, params);

      for await (const page of pagesStream) {
        if (!this.isResultNew(page.created_time, lastCreatedTimestamp)
          || (max && pages.length >= max)) {
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
  },
  async run() {
    await this.processEvents(100);
  },
  sampleEmit,
};
