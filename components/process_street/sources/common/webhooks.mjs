import processStreet from "../../process_street.app.mjs";

export default {
  type: "source",
  props: {
    processStreet,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    workflowId: {
      propDefinition: [
        processStreet,
        "workflowId",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      console.log("Creating webhook...");
      const webhookTypes = this.getWebhookTypes();
      const { id } = await this.processStreet.createWebhook({
        data: {
          url: this.http.endpoint,
          workflowId: this.workflowId,
          triggers: webhookTypes,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      console.log("Deleting webhook...");
      await this.processStreet.deleteWebhook({
        id: this._getWebhookId(),
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    getWebhookTypes() {
      throw new Error("Missing implementation for getWebhookTypes() method");
    },
    emitEvent() {
      throw new Error("Missing implementation for emitEvent() method");
    },
  },
  async run(event) {
    console.log("Webhook received");
    const data = event.body.data;
    this.emitEvent(data);
  },
};
