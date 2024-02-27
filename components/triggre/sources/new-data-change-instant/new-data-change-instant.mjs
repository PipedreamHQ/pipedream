import triggre from "../../triggre.app.mjs";

export default {
  key: "triggre-new-data-change-instant",
  name: "New Data Change Instant",
  description: "Emit new event when a data change (addition, modification or deletion) occurs in Triggre",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    triggre,
    listenTo: {
      propDefinition: [
        triggre,
        "listenTo",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.triggre.emitDataChange(this.listenTo);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const id = this.db.get("webhookId");
      await this.triggre.deleteWebhook(id);
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New event: ${body.name}`,
      ts: Date.parse(body.ts),
    });
  },
};
