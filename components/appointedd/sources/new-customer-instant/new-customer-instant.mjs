import appointedd from "../../appointedd.app.mjs";

export default {
  key: "appointedd-new-customer-instant",
  name: "New Customer Instant",
  description: "Emits an event when a new customer is created in one of your Appointedd organisations",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    appointedd,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.appointedd.getCustomers();
      if (customers.length > 0) {
        const sortedCustomers = customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        this.db.set("lastCustomerCreatedAt", new Date(sortedCustomers[0].created_at));
      }
    },
  },
  async run() {
    const customers = await this.appointedd.getCustomers();
    const lastCustomerCreatedAt = this.db.get("lastCustomerCreatedAt");
    const newCustomers = customers.filter((customer) => new Date(customer.created_at) > new Date(lastCustomerCreatedAt));

    for (const customer of newCustomers) {
      this.$emit(customer, {
        id: customer.id,
        summary: `New Customer: ${customer.first_name} ${customer.last_name}`,
        ts: Date.parse(customer.created_at),
      });
    }

    if (newCustomers.length > 0) {
      const sortedNewCustomers = newCustomers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      this.db.set("lastCustomerCreatedAt", new Date(sortedNewCustomers[0].created_at));
    }
  },
};
