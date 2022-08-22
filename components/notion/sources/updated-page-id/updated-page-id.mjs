import notion from "../../notion.app.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-updated-page-id",
  name: "Updated Page ID", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a selected page is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
    },
  },
  async run() {
    const page = await this.notion.retrievePage(this.pageId);

    if (this.isResultNew(page.last_edited_time, this.getLastUpdatedTimestamp())) {
      const meta = this.generateMeta(
        page,
        constants.types.PAGE,
        constants.timestamps.LAST_EDITED_TIME,
        constants.summaries.PAGE_UPDATED,
        true,
      );

      this.$emit(page, meta);
      this.setLastUpdatedTimestamp(Date.parse(page.last_edited_time));
    }
  },
};
