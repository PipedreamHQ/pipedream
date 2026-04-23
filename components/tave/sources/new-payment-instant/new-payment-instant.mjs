import tave from "../../tave.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tave-new-payment-instant",
  name: "New Payment Created",
  description: "Emit new event when a new payment is created. [See the documentation](https://tave.io/v2/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tave,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    paymentId: {
      propDefinition: [
        tave,
        "paymentId",
      ],
    },
    orderId: {
      propDefinition: [
        tave,
        "orderId",
      ],
      optional: true,
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
      const events = await this.tave.emitNewPaymentEvent(this.paymentId, this.orderId);
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          summary: `Historical payment event for payment ID: ${event.id}`,
          ts: Date.now(),
        });
      }
    },
    async activate() {
      const hookId = await this.tave.emitNewPaymentEvent(this.paymentId, this.orderId);
      this._setWebhookId(hookId);
    },
    async deactivate() {
      const hookId = this._getWebhookId();
      // Implement the logic to delete the webhook, if supported by the API
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.paymentId,
      summary: `New payment created with ID: ${event.body.paymentId}`,
      ts: Date.now(),
    });
  },
};
