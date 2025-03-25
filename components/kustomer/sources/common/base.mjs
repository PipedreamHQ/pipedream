import kustomer from "../../kustomer.app.mjs";

export default {
  props: {
    kustomer,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook to be identified in the UI",
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.kustomer.createWebhook({
        data: {
          name: this.name,
          url: this.http.endpoint,
          events: this.getEventType(),
        },
      });
      this._setHookId(response.data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.kustomer.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.createdAt);
    this.$emit(body, {
      id: body.id,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
