import crypto from "crypto";
import taiga from "../../taiga.app.mjs";

export default {
  props: {
    taiga,
    db: "$.service.db",
    http: "$.interface.http",
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook.",
    },
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
      const response = await this.taiga.createHook({
        data: {
          key: crypto.randomUUID(),
          name: this.name,
          url: this.http.endpoint,
          project: this.projectId,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.taiga.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    if (!this.filterEvent(body)) return;

    const ts = body.created || Date.now();
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
