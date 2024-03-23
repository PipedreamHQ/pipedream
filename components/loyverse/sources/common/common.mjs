import app from "../../loyverse.app.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(value) {
      this.db.set("webhookId", value);
    },
  },
  hooks: {
    async activate() {
      const data = {
        type: this.getHookType(),
        url: this.http.endpoint,
      };

      const { id } = await this.app.createWebhook({
        data,
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.app.deleteWebhook(id);
      }
    },
  },
  async run({ body }) {
    const { data } = body;
    if (data) {
      this.$emit(body, {
        id: data.id,
        summary: "New event",
        ts: Date.now(),
      });
    }
  },
};
