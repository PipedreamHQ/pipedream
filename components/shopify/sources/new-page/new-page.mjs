import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-page",
  name: "New Page",
  type: "source",
  description: "Emit new event for each new page published.",
  version: "0.0.6",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    shopify,
  },
  async run() {
    const sinceId = this.db.get("since_id") || null;
    let results = await this.shopify.getPages(sinceId);

    for (const page of results) {
      this.$emit(page, {
        id: page.id,
        summary: page.title,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};
