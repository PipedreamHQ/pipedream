import woovi from "../../woovi.app.mjs";

export default {
  props: {
    woovi,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { webhook } = await this.woovi.createWebhook({
        data: {
          webhook: {
            name: "Pipedream Webhook",
            event: this.getEvent(),
            url: this.http.endpoint,
            isActive: true,
          },
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.woovi.deleteWebhook({
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
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body?.event) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
