import app from "../../frame.app.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
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
        url: this.http.endpoint,
        name: `Pipedream Source (${this.getHookName()})`,
        events: this.getHookData(),
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
