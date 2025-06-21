import prodatakey from "../../prodatakey.app.mjs";

export default {
  props: {
    prodatakey,
    db: "$.service.db",
    http: "$.interface.http",
    organizationId: {
      propDefinition: [
        prodatakey,
        "organizationId",
      ],
    },
    name: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook",
    },
  },
  hooks: {
    async activate() {
      const response = await this.prodatakey.createHook({
        organizationId: this.organizationId,
        data: {
          name: this.name,
          url: this.http.endpoint,
          scope: "this",
          authentication: {
            type: "None",
          },
          events: this.getEvent(),
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.prodatakey.deleteHook({
        organizationId: this.organizationId,
        webhookId,
      });
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
