import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-new-draft-order",
  name: "New Draft Order",
  type: "source",
  description: "Emit new event for each new draft order submitted to a store. [See docs here](https://shopify.dev/api/admin-graphql/2022-04/queries/draftOrders)",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    shopify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  async run() {
    let results = await this.shopify.getDraftOrders("any");

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
