import hystruct from "../../hystruct.app.mjs";

export default {
  key: "hystruct-new-data-entry-instant",
  name: "New Data Entry Instant",
  description: "Emits an event when a new data entry is scraped. [See the documentation](https://docs.hystruct.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    hystruct: {
      type: "app",
      app: "hystruct",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    outputUrl: hystruct.propDefinitions.outputUrl,
    dataset: {
      ...hystruct.propDefinitions.dataset,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.hystruct.subscribeNewWebhook({
        data: {
          outputUrl: this.outputUrl,
          dataset: this.dataset,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.hystruct.unsubscribeWebhook({
          webhookId,
        });
      }
    },
  },
  async run(event) {
    this.hystruct.emitNewEvent(event.body);
  },
};
