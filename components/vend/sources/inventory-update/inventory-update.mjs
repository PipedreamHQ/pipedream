import vend from "../../vend.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "New Inventory Update",
  version: "0.0.1",
  key: "vend-inventory-update",
  description: "Emit new event for each update on inventory. [See docs here](https://docs.vendhq.com/reference/post-webhooks)",
  type: "source",
  dedupe: "unique",
  props: {
    vend,
    db: "$.service.db",
    http: "$.interface.http",
    eventType: {
      label: "Event Type",
      description: "The type of the event",
      type: "string",
      options: constants.WEBHOOK_EVENT_TYPES,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.vend.createWebhook({
        url: this.http.endpoint,
        active: true,
        type: this.eventType,
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.vend.removeWebhook(webhookId);
    },
  },
  async run(event) {
    const { body: { payload } } = event;

    const resource = JSON.parse(payload);

    const ts = new Date();

    this.$emit(resource, {
      id: ts,
      summary: `New event ${this.eventType} (${resource.id}) `,
      ts: ts,
    });
  },
};
