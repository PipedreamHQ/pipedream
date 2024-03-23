import app from "../../loyverse.app.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    getSummary() {
      return "New event";
    },
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
        status: "ENABLED",
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
    if (body) {
      const ts = Date.now();
      this.$emit(body, {
        id: ts,
        summary: this.getSummary(body),
        ts,
      });
    }
  },
};
