import heartbeat from "../../heartbeat.app.mjs";

export default {
  props: {
    heartbeat,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
  },
  hooks: {
    async activate() {
      const response = await this.heartbeat.createHook({
        data: {
          url: this.http.endpoint,
          action: {
            name: this.getEvent(),
          },
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.heartbeat.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    const fn = this.getFunction();
    const eventBody = await fn(body.id);
    const ts = this.getDate(eventBody);

    this.$emit(eventBody, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
