import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-draft-order",
  name: "New Draft Order",
  type: "source",
  description: "Emit new event for each new draft order submitted to a store. [See docs here](https://shopify.dev/api/admin-graphql/2022-04/queries/draftOrders)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
  },
  async run() {
    const sinceId = this.db.get("since_id") || null;
    let results = await this.shopify.getDraftOrders("any", true, sinceId);

    for (const order of results) {
      this.$emit(order, {
        id: order.id,
        summary: `Draft Order ${order.name}`,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};
