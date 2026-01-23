import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "qualiobee-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when a new customer is created in Qualiobee. [See the documentation](https://app.qualiobee.fr/api/doc/#/Customer/PublicCustomerController_getMany)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.qualiobee.listCustomers;
    },
    generateMeta(customer) {
      return {
        id: customer.uuid,
        summary: `New Customer with UUID ${customer.uuid}`,
        ts: Date.parse(customer.creationDate),
      };
    },
  },
};
