import tave from "../../tave.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tave-new-order-booked-instant",
  name: "New Order Booked",
  description: "Emit new event when an order is booked, including manually booked orders in manager and electronic bookings in client access. [See the documentation](https://tave.io/v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tave,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    orderId: {
      propDefinition: [
        tave,
        "orderId",
      ],
    },
    managerId: {
      propDefinition: [
        tave,
        "managerId",
      ],
    },
    clientId: {
      propDefinition: [
        tave,
        "clientId",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const events = await this.tave.emitNewOrderEvent(this.orderId, this.managerId, this.clientId);
      for (const event of events.slice(-50)) {
        this.$emit(event, {
          id: event.id,
          summary: `New order booked with ID ${event.id}`,
          ts: Date.parse(event.createdAt),
        });
      }
    },
    async activate() {
      const hookId = await this.tave.emitNewOrderEvent(this.orderId, this.managerId, this.clientId);
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.tave._makeRequest({
          method: "DELETE",
          path: `/webhooks/${id}`,
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    const expectedSignature = {}; // Add logic to compute expected signature
    const webhookSignature = event.headers["x-webhook-signature"];

    if (webhookSignature !== expectedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    this.$emit(body, {
      id: body.orderId,
      summary: `Order booked: ${body.orderId}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
