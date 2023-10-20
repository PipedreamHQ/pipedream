import nocrm_io from "../../nocrm_io.app.mjs";

export default {
  props: {
    nocrm_io,
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
    async deploy(event) {
      throw new Error("deploy is not implemented", event);
    },
  },
  hooks: {
    async deploy() {
      await this.deploy();
    },
    async activate() {
      const response = await this.nocrm_io.createWebhook({
        data: {
          target: this.http.endpoint,
          target_type: "url",
          event: this.getWebhookEventType(),
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.nocrm_io.removeWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
