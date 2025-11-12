import common from "../common/base.mjs";

export default {
  ...common,
  key: "cogmento-new-deal-created",
  name: "New Deal Created",
  description: "Emit new event when a new deal is created in Cogmento. [See the documentation](https://api.cogmento.com/static/swagger/index.html#/Deals/get_deals_)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.cogmento.listDeals;
    },
    getSummary(item) {
      return `New Deal Created: ${item.title}`;
    },
  },
};
