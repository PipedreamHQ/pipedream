import paigo from "../../paigo.app.mjs";

export default {
  props: {
    paigo,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const data = {
        hookUrl: this.http.endpoint,
        webhookType: this.getWebhookType(),
      };
      if (this.offeringId) {
        data.offeringId = this.offeringId;
      }
      const { webhookId } = await this.paigo.createWebhook({
        data,
      });
      this._setHookId(webhookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.paigo.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getWebhookType() {
      throw new Error("getWebhookType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
