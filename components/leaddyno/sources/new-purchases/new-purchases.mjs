import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "leaddyno-new-purchases",
  name: "New Purchases",
  description: "Emit new event when a new purchase is created in LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/purchases/get-purchases)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.leaddyno.listPurchases;
    },
    getSummary(item) {
      return `New Purchase: ${item.purchase_code} - $${item.purchase_amount}`;
    },
  },
  sampleEmit,
};
