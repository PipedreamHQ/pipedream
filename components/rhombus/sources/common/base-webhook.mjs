import rhombus from "../../rhombus.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    rhombus,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { webhookId } = await this.rhombus.createWebhook({
        hookUrl: this.http.endpoint,
        zapEnum: this.getEventType(),
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.rhombus.deleteWebhook({
          data: {
            webhookId,
          },
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    generateMeta(event) {
      return {
        id: event.alertUuid,
        summary: event.summary,
        ts: event.timestampMs,
      };
    },
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
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
