import mautic from "../../mautic.app.mjs";

export default {
  dedupe: "unique",
  type: "source",
  props: {
    mautic,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {},
    async activate() {
      console.log("Creating webhook...");
      const webhookId = await this.mautic.createWebhook({
        webhookUrl: this.http.endpoint,
        eventType: this.getEventType(),
      });
      this.setWebhookId(webhookId);
      console.log(`Webhook ${webhookId} created successfully`);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      console.log(`Deleting webhook ${webhookId}...`);
      await this.mautic.deleteWebhook({
        webhookId,
      });
      this.setWebhookId();
      console.log(`Webhook ${webhookId} deleted successfully`);
    },
  },
  methods: {
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  async run(event) {
    console.log("Raw received event:");
    console.log(event);
    for (const body of event.body[this.getEventType()]) {
      this.emitEvent(body);
    }
  },
};
