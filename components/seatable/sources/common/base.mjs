import seatable from "../../seatable.app.mjs";

export default {
  props: {
    seatable,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { webhook } = await this.seatable.createWebhook({
        data: {
          url: this.http.endpoint,
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.seatable.deleteWebhook({
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
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (this.isRelevant(body)) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
