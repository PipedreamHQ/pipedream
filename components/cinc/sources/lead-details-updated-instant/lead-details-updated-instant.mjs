import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-lead-details-updated-instant",
  name: "Lead Details Updated Instant",
  description: "Emits an event when a lead's information is updated in Cinc",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cinc,
    http: "$.interface.http",
    db: "$.service.db",
    leadIdentifier: {
      propDefinition: [
        cinc,
        "leadIdentifier",
      ],
    },
    updatedDetails: {
      propDefinition: [
        cinc,
        "updatedDetails",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.cinc.createWebhook({
        url: this.http.endpoint,
        events: [
          "lead.updated",
        ],
      });
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const id = this.db.get("webhookId");
      await this.cinc.deleteWebhook(id);
    },
  },
  async run(event) {
    const { body } = event;
    if (body && body.data && body.data.id === this.leadIdentifier) {
      this.$emit(body, {
        id: body.id,
        summary: `Lead ${body.data.id} updated`,
        ts: Date.now(),
      });
    }
  },
};
