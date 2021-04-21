const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-updated-customer",
  name: "Updated Customer",
  description: "Emits an event each time a customer's information is updated.",
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
    const lastUpdatedAt = this.db.get("last_updated_at") || null;
    let results = await this.shopify.getCustomers(null, lastUpdatedAt);

    for (const customer of results) {
      const dedupeId = `${customer.id}-${customer.updated_at}`;
      this.$emit(customer, {
        id: dedupeId,
        summary: `${customer.first_name} ${customer.last_name}`,
        ts: Date.now(),
      });
    }

    if (results[results.length - 1]) {
      this.db.set("last_updated_at", results[results.length - 1].updated_at);
    }
  },
};
