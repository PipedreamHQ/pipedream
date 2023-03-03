import fibery from "../../fibery.app.mjs";

export default {
  props: {
    fibery,
    db: "$.service.db",
    http: "$.interface.http",
    type: {
      propDefinition: [
        fibery,
        "type",
      ],
    },
  },
  hooks: {
    async deploy() {
      const [
        response,
      ] = await this.fibery.listHistoricalEntities({
        type: this.type.label,
        fieldName: this.getFieldName(),
      });

      console.log(response);

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
    getFieldName() {
      const database = this.type.label.split("/")[0];
      return `${database}/name`;
    },
    getEntityId(entity) {
      return entity["fibery/id"] || entity["id"];
    },
  },
};
