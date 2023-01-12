import regfox from "../../regfox.app.mjs";

export default {
  props: {
    regfox,
    http: "$.interface.http",
    db: "$.service.db",
    forms: {
      propDefinition: [
        regfox,
        "forms",
      ],
    },
  },
  hooks: {
    async activate() {
      console.log("Creating webhook...");

      const response = await this.regfox.createWebhook({
        url: this.http.endpoint,
        events: this.eventTypes(),
        forms: this.forms.map((form) => ({
          formId: form,
        })),
      });

      console.log(`Webhook ID: ${response.id} created succesfully`);
      this.setWebhookId(response.id);
      this.setSigningSecret(response.signingSecret);
    },
    async deactivate() {
      const id = this.getWebhookId();
      await this.regfox.deleteWebhook(id);
      console.log(`Webhook ${id} deleted successfully`);
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getSigningSecret() {
      return this.db.get("signingSecret");
    },
    _setSigningSecret(signingSecret) {
      this.db.set("signingSecret", signingSecret);
    },
    eventTypes() {
      throw new Error("eventTypes is not implemented");
    },
  },
  async run(event) {
    this.processEvent(event.body);
  },
};
