import moneybird from "../../moneybird.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "New Webhook event",
  version: "0.0.1",
  key: "moneybird-new-webhook-event",
  description: "Emit new event on each webhook event. [See docs here](https://developer.moneybird.com/webhooks/)",
  type: "source",
  dedupe: "unique",
  props: {
    moneybird,
    db: "$.service.db",
    http: "$.interface.http",
    events: {
      label: "Webhook Events",
      description: "The webhook events to listen",
      type: "string[]",
      options: constants.WEBHOOK_EVENTS,
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
      const response = await this.moneybird.createWebhook({
        url: this.http.endpoint,
        events: this.events,
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.moneybird.removeWebhook(webhookId);
    },
  },
  async run(event) {
    const { body } = event;

    this.$emit(body.entity, {
      id: body.entity.id,
      summary: `New event ${body.action} for entity ${body.entity.id}`,
      ts: new Date(),
    });
  },
};
