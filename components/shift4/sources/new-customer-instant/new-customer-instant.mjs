import shift4 from "../../shift4.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shift4-new-customer-instant",
  name: "New Customer Instant",
  description: "Emits an event when a new customer is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    shift4,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.shift4.listCustomers();
      customers.slice(-50).forEach((customer) => {
        this.$emit(customer, {
          id: customer.id,
          summary: `New customer: ${customer.email}`,
          ts: Date.parse(customer.created_at),
        });
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "",
    });

    const body = event.body;
    if (body.type === "CUSTOMER_CREATED") {
      this.$emit(body, {
        id: body.data.id,
        summary: `New customer: ${body.data.email}`,
        ts: Date.parse(body.data.created_at),
      });
    }
  },
};
