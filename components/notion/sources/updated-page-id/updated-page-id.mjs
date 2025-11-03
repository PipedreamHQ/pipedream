import notion from "../../notion.app.mjs";
import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "notion-updated-page-id",
  name: "Page Updated", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a selected page is updated. [See the documentation](https://developers.notion.com/reference/page)",
  version: "0.0.13",
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
