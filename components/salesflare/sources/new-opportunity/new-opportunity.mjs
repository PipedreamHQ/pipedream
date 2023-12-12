import common from "../common/common.mjs";

export default {
  ...common,
  key: "salesflare-new-opportunity",
  name: "New Opportunity Event",
  description: "Emit new events when new opportunities are created. [See the docs](https://api.salesflare.com/docs#operation/getOpportunities)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getOpportunities;
    },
    getSummary(item) {
      return `New opportunity ${item.name} (ID: ${item.id})`;
    },
  },
};
