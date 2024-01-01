import espoCrm from "../../espo-crm.app.mjs";

export default {
  key: "espo-crm-new-changes-instant",
  name: "New Changes Instant",
  description: "Emits an event upon the creation, update, deletion, or changes of any field in various entity types.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    espoCrm,
    entityType: {
      propDefinition: [
        espoCrm,
        "entityType",
      ],
    },
    field: {
      propDefinition: [
        espoCrm,
        "field",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.espoCrm.trackEntityChanges({
        entityType: this.entityType,
        field: this.field,
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      await this.espoCrm.deleteWebhook(this.db.get("webhookId"));
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["X-Hook-Secret"]) {
      this.http.respond({
        status: 200,
        headers: {
          "X-Hook-Secret": headers["X-Hook-Secret"],
        },
      });
      return;
    }
    this.$emit(body, {
      id: headers["x-pipe-id"],
      summary: `${body.action} ${body.entityType}`,
      ts: Date.parse(body.timestamp),
    });
  },
};
