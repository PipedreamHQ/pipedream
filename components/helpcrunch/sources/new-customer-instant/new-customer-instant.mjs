import helpcrunch from "../../helpcrunch.app.mjs";

export default {
  key: "helpcrunch-new-customer-instant",
  name: "New Customer Instant",
  version: "0.0.{{ts}}",
  description: "Emit new event when a new customer is created. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1)",
  type: "source",
  dedupe: "unique",
  props: {
    helpcrunch: {
      type: "app",
      app: "helpcrunch",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      // No-op
    },
    async deactivate() {
      // No-op
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    if (headers["Content-Type"] !== "application/json") {
      return this.http.respond({
        status: 400,
      });
    }
    let data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      return this.http.respond({
        status: 400,
      });
    }
    if (data.event !== "customer_created") {
      return this.http.respond({
        status: 200,
      });
    }
    const customer = await this.helpcrunch.getCustomer(data.customerId);
    this.$emit(customer, {
      id: customer.id,
      summary: `New customer created: ${customer.name}`,
      ts: Date.now(),
    });
    this.http.respond({
      status: 200,
    });
  },
};
