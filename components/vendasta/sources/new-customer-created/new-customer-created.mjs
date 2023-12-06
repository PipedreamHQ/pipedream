import common from "../common/base.mjs";

export default {
  ...common,
  key: "vendasta-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer has been added in Vendasta [See the documentation](https://developers.vendasta.com/platform/c05ce7bb1681c-list-customers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `New Customer ID ${customer.id}`,
        ts: Date.parse(customer.attributes.createdAt),
      };
    },
  },
};
