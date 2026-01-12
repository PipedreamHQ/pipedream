import bugherd from "../../bugherd.app.mjs";

export default {
  props: {
    bugherd,
    db: "$.service.db",
    http: "$.interface.http",
    projectId: {
      propDefinition: [
        bugherd,
        "projectId",
      ],
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
      const response = await this.bugherd.createHook({
        data: {
          project_id: this.projectId,
          target_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });
      this._setWebhookId(response.webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.bugherd.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
