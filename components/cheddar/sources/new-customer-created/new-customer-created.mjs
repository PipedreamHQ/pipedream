import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "cheddar-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created. [See the documentation](https://docs.getcheddar.com/#customers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: Product must containt at least one customer to create source",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.cheddar.listCustomers;
    },
    getResourceType() {
      return "customer";
    },
    generateMeta(customer) {
      return {
        id: customer["@_id"],
        summary: `New Customer with ID ${customer["@_id"]}`,
        ts: Date.parse(customer.createdDatetime),
      };
    },
  },
};
