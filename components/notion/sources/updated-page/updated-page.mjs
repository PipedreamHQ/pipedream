import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "notion-udpated-page",
  name: "Updated Page", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event when a page is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "last",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
    },
  },
  async run() {
    const params = {
      start_cursor: utils.getLastCursor(this.db),
    };

    do {
      const response = await this.notion.queryDatabase(this.databaseId, params);

      response.results.forEach((page) => {
        const title = this.notion.extractPageTitle(page);

        this.$emit(page, {
          id: page.id,
          summary: `Page updated: ${title} - ${page.id}`,
          ts: Date.parse(page.last_edited_time),
        });
      });

      params.start_cursor = response.next_cursor;
      if (params.start_cursor) {
        utils.setLastCursor(this.db, params.start_cursor);
      }
    } while (params.start_cursor);
  },
};
