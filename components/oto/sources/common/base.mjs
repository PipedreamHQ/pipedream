import oto from "../../oto.app.mjs";

export default {
  props: {
    oto,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.oto.createWebhook({
        data: {
          url: this.http.endpoint,
          method: "POST",
          webhookType: this.getWebhookType(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      if (id) {
        await this.oto.deleteWebhook({
          params: {
            id,
          },
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
      throw new Error ("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
