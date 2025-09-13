import notion from "../../notion.app.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "notion-updated-page-by-timestamp",
  name: "New or Updated Page in Data Source (By Timestamp)",
  description: "Emit new event when a page is created or updated in the selected data source. [See the documentation](https://developers.notion.com/reference/page)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    dataSourceId: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
    },
    includeNewPages: {
      type: "boolean",
      label: "Include New Pages",
      description: "Set to `false` to emit events only for updates, not for new pages.",
      default: true,
    },
  },
  methods: {
    ...base.methods,
    _generateMeta(obj, summary) {
      const { id } = obj;
      const title = this.notion.extractPageTitle(obj);
      const ts = Date.parse(obj.last_edited_time);
      return {
        id: `${id}-${ts}`,
        summary: `${summary}: ${title}`,
        ts,
      };
    },
    _emitEvent(page, isNewPage = true) {
      const meta = isNewPage
        ? this._generateMeta(page, constants.summaries.PAGE_ADDED)
        : this._generateMeta(page, constants.summaries.PAGE_UPDATED);
      this.$emit(page, meta);
    },
  },
  async run() {
    const lastUpdatedTimestamp = this.getLastUpdatedTimestamp();
    let newLastUpdatedTimestamp = lastUpdatedTimestamp;

    const params = {
      ...this.lastUpdatedSortParam(),
      filter: {
        timestamp: "last_edited_time",
        last_edited_time: {
          on_or_after: new Date(lastUpdatedTimestamp).toISOString(),
        },
      },
    };

    const pagesStream = this.notion.getPages(this.dataSourceId, params);

    for await (const page of pagesStream) {
      if (lastUpdatedTimestamp > Date.parse(page.last_edited_time)) {
        break;
      }

      newLastUpdatedTimestamp = Math.max(
        newLastUpdatedTimestamp,
        Date.parse(page.last_edited_time),
      );

      const isNewPage = page.last_edited_time === page.created_time;

      if (isNewPage && !this.includeNewPages) {
        console.log(`Ignoring new page: ${page.id}`);
        continue;
      }

      this._emitEvent(page, isNewPage);
    }

    this.setLastUpdatedTimestamp(newLastUpdatedTimestamp);
  },
  sampleEmit,
};
