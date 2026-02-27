import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "remarkety-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event for every new customer created. [See the documentation](http://static.remarkety.com.s3-website-us-east-1.amazonaws.com/api-docs/#!/Customers/get_customers)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvents(max) {
      const lastTs = this._getLastTs();
      const results = this.remarkety.paginate({
        fn: this.remarkety.listCustomers,
        resourceKey: "customers",
      });
      let customers = [];
      for await (const customer of results) {
        const ts = Date.parse(customer.created_at);
        if (ts > lastTs) {
          customers.push(customer);
        }
      }
      if (!customers.length) {
        return;
      }
      if (max && customers.length > max) {
        customers = customers.slice(-1 * max);
      }
      this._setLastTs(Date.parse(customers[customers.length - 1].created_at));
      customers.forEach((customer) => this.$emit(customer, this.generateMeta(customer)));
    },
    generateMeta(customer) {
      return {
        id: customer.hash,
        summary: `New Customer ${customer.email}`,
        ts: Date.parse(customer.created_at),
      };
    },
  },
};
