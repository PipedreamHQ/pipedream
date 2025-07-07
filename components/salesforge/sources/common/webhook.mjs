import { v4 as uuid } from "uuid";
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
      const { id } = data;
      return {
        id: id || uuid(),
        summary: this.getSummary(data),
        ts: Date.now(),
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
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.salesforge.deleteWebhook({
          workspaceId: this.workspaceId,
          webhookId,
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    if (body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
