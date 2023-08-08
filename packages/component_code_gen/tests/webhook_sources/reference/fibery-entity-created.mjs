export default {
  key: "fibery-entity-created",
  name: "New Entity Created",
  description: "Emit new event for every created entity of a certain type. [See the docs here](https://api.fibery.io/#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    fibery: {
      type: "app",
      app: "fibery",
    },
    db: "$.service.db",
    http: "$.interface.http",
    type: {
      type: "string",
      label: "Type",
      description: "A custom type in your Fibery account",
      async options() {
        const types = await this.listTypes();
        return types.map((t) => ({
          label: t["fibery/name"],
          value: t["fibery/id"],
        }));
      },
      withLabel: true,
    },
  },
  hooks: {
    async deploy() {
      const response = await this.fibery.listHistoricalEntities({
        type: this.type.label,
      });
      response.result.forEach((entity) => {
        this.$emit(entity, {
          id: entity["fibery/id"],
          summary: `Historical entity: ${this.getEntityId(entity)}`,
          ts: entity["fibery/creation-date"],
        });
      });
    },
    async activate() {
      const response = await this.fibery.createWebhook({
        data: {
          url: this.http.endpoint,
          type: this.type.value,
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
    getEntityId(entity) {
      return entity["fibery/id"] || entity["id"];
    },
  },
  async run(event) {
    console.log(`Received new event with ${event.body.effects.length} sequence(s)`);
    event.body.effects
      .filter(({ effect }) => effect === "fibery.entity/create")
      .forEach((entity) => {
        this.$emit(entity, {
          id: entity.id,
          summary: `New created entity: ${this.getEntityId(entity)}`,
          ts: entity.values["fibery/creation-date"],
        });
      });
  },
};
