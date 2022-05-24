import shipstation from "../../shipstation.app.mjs";
import contants from "./constants.mjs";

export default {
  props: {
    shipstation,
    db: "$.service.db",
    http: "$.interface.http",
    eventType: {
      label: "Event Type",
      description: "The type of webhook to subscribe to",
      type: "string",
      options: contants.WEBHOOK_EVENTS,
    },
    storeId: {
      label: "Store",
      description: "The store to receive the events",
      propDefinition: [
        shipstation,
        "storeId",
      ],
      optional: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.shipstation.createWebhook({
        data: {
          target_url: this.http.endpoint,
          event: this.eventType,
          store_id: this.storeId,
          friendly_name: `${(new Date).getTime()} - ${this.eventType}`,
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.shipstation.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    await this.emitEvent(event);
  },
};
