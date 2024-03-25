import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-new-customer-instant",
  name: "New Customer Instant",
  description: "Emits an event whenever a new customer is registered.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    recharge,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    customerId: {
      propDefinition: [
        recharge,
        "customerId",
      ],
    },
    customerEmail: {
      propDefinition: [
        recharge,
        "customerEmail",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch customers on deploy to avoid emitting events for existing customers
      const customers = await this.recharge._makeRequest({
        path: "/customers",
      });
      customers.forEach((customer) => {
        this.db.set(customer.id.toString(), customer);
      });
    },
  },
  async run() {
    const customers = await this.recharge._makeRequest({
      path: "/customers",
    });

    customers.forEach((customer) => {
      const existingCustomer = this.db.get(customer.id.toString());
      if (!existingCustomer) {
        this.$emit(customer, {
          id: customer.id.toString(),
          summary: `New Customer: ${customer.first_name} ${customer.last_name}`,
          ts: Date.parse(customer.created_at),
        });
        this.db.set(customer.id.toString(), customer);
      }
    });
  },
};
