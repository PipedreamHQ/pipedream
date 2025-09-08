import salesforge from "../../salesforge.app.mjs";

export default {
  props: {
    salesforge,
    db: "$.service.db",
    http: "$.interface.http",
    workspaceId: {
      propDefinition: [
        salesforge,
        "workspaceId",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    generateMeta(data) {
      const { webhookInfo } = data;
      const ts = webhookInfo?.eventTime
        ? new Date(webhookInfo.eventTime).valueOf()
        : Date.now();
      const id = `${this.getEventType()}-${ts}`;
      return {
        id,
        summary: this.getSummary(data),
        ts,
      };
    },
  },
  hooks: {
    async activate() {
      const response = await this.salesforge.createWebhook({
        workspaceId: this.workspaceId,
        data: {
          name: `Pipedream ${this.getEventType()} webhook`,
          type: this.getEventType(),
          url: this.http.endpoint,
        },
      });
      this._setWebhookId(response.id);
    },
    // Salesforge does not seem to support deactivating/deleting webhooks via the API
  },
  async run(event) {
    const { body } = event;
    if (body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
