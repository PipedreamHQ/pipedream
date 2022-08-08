import awork from "../../awork.app.mjs";

export default {
  props: {
    awork,
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
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    deploy(event) {
      throw new Error("deploy is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      const response = await this.awork.createWebhook({
        data: {
          name: `Pipedream - ${new Date().getTime()}`,
          uri: this.http.endpoint,
          events: this.getWebhookEventType(),
          authenticationType: "none",
          isActive: true,
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.awork.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
