import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-entity-created-or-updated",
  name: "Entity Created or Updated",
  description: "Emit new event for every created or updated entity",
  type: "source",
  dedupe: "unique",
  version: "0.0.1",
  props: {
    fibery,
    db: "$.service.db",
    http: "$.interface.http",
    entityType: {
      propDefinition: [
        fibery,
        "entityType",
      ],
    },
  },
  hooks: {
    async deploy() {},
    async activate() {
      const response = await this.fibery.createWebhook({
        data: {
          url: this.http.endpoint,
          type: this.entityType,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.fibery.deleteWebhook({
        webhookId,
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  async run(event) {
    console.log("Received new event");
    this.$emit(event.body, {
      id: event.body.sequenceId,
      summary: `Received ${event.body.effects.length} sequence(s) for event`,
      ts: event.body.creationDate,
    });
  },
};
