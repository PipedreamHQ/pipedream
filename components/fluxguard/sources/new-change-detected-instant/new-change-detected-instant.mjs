import app from "../../fluxguard.app.mjs";

export default {
  key: "fluxguard-new-change-detected-instant",
  name: "New Change Detected Instant",
  description: "Emit new event when a change is detected to a web page. [See the documentation](https://docs.fluxguard.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.session.id,
        summary: `New event with ID ${data.session.id}`,
        ts: Date.parse(data.capturedAt),
      });
    },
  },
  hooks: {
    async activate() {
      const response = await this.app.createWebhook({
        data: {
          url: this.http.endpoint,
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();

      await this.app.removeWebhook({
        data: {
          id: webhookId,
        },
      });
    },
  },
  async run(event) {
    await this.emitEvent(event.body);
  },
};
