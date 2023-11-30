import shoprocket from "../../shoprocket.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shoprocket-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a customer is created. [See the documentation](https://api.shoprocket.io/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    shoprocket,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    customerEmail: {
      propDefinition: [
        shoprocket,
        "customerEmail",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Since this is an instant trigger, there's no need to fetch historical data
    },
    async activate() {
      // No webhook activation needed, assuming the new customer event will be sent to the HTTP prop endpoint
    },
    async deactivate() {
      // No webhook deactivation needed, assuming the new customer event will be sent to the HTTP prop endpoint
    },
  },
  async run(event) {
    const body = event.body;
    const headers = event.headers;

    // Signature validation if supported by the app
    // If the app supports webhook signature validation, include the code for validation here.

    // Assuming the webhook sends the customer email in the event body for identification
    const customerEmail = body && body.email;

    // Validate that the incoming webhook is for a customer creation event
    if (customerEmail === this.customerEmail) {
      this.$emit(body, {
        id: body.id || this.db.get("lastId") + 1,
        summary: `New customer created: ${customerEmail}`,
        ts: Date.parse(body.created_at) || Date.now(),
      });
      this.db.set("lastId", body.id || this.db.get("lastId") + 1);
    } else {
      this.http.respond({
        status: 404,
        body: "Customer email not found or doesn't match the configured prop",
      });
    }
  },
};
