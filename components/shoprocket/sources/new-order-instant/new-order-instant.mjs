import shoprocket from "../../shoprocket.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shoprocket-new-order-instant",
  name: "New Order (Instant)",
  description: "Emits an event when a new order is placed. [See the documentation](https://docs.shoprocket.io/)",
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
    orderId: {
      propDefinition: [
        shoprocket,
        "orderId",
      ],
    },
    customerEmail: {
      propDefinition: [
        shoprocket,
        "customerEmail",
      ],
    },
    orderedProducts: {
      propDefinition: [
        shoprocket,
        "orderedProducts",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical data
      // Since it's not clear how to fetch the last 50 orders, this is left as a placeholder
    },
    async activate() {
      // Create webhook subscription and save the ID for later deletion
      // Since the API documentation details are not provided, this is left as a placeholder
    },
    async deactivate() {
      // Delete webhook subscription using the ID saved during activation
      // Since the API documentation details are not provided, this is left as a placeholder
    },
  },
  async run(event) {
    const { body } = event;

    // Validate webhook payload
    if (!body || !body.orderId || !body.customerEmail) {
      throw new Error("Received webhook without order details");
    }

    // Emit the new order event
    this.$emit(body, {
      id: body.orderId,
      summary: `New order ${body.orderId} placed by ${body.customerEmail}`,
      ts: Date.parse(body.created_at) || Date.now(),
    });

    // Respond to the webhook immediately
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};
