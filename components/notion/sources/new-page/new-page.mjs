import notion from "../../notion.app.mjs";

export default {
  key: "notion-new-page",
  name: "New Page",
  description: "Emit new event when a page is created",
  version: "0.0.1",
  type: "source",
  dedupe: "last",
  props: {
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
    const response = await this.notion.queryDatabase(this.databaseId);

    response.results.forEach((page) => {
      const title = this.notion.extractPageTitle(page);

      this.$emit(page, {
        id: page.id,
        summary: `Page added: ${title} - ${page.id}`,
        ts: Date.parse(page.created_time),
      });
    });
  },
};
