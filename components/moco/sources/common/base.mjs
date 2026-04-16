import moco from "../../moco.app.mjs";

export default {
  props: {
    moco,
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
    getEntityType() {
      throw new Error("getEntityType() must be implemented");
    },
    getEvent() {
      throw new Error("getEvent() must be implemented");
    },
    getSummary() {
      throw new Error("getSummary() must be implemented");
    },
  },
  hooks: {
    async activate() {
      const response = await this.moco.createWebhook({
        data: {
          hook: this.http.endpoint,
          target: this.getEntityType(),
          event: this.getEvent(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.moco.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.created_at);
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
