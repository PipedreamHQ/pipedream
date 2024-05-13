import twenty from "../../twenty.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "twenty-new-record-modified-instant",
  name: "New Record Modified (Instant)",
  description: "Emit new event when a record is created, updated, or deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    twenty,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data } = await this.twenty.createHook({
        data: {
          targetUrl: this.http.endpoint,
          operation: "*.*",
        },
      });

      this.db.set("webhookId", data.createWebhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.twenty.deleteHook(webhookId);
    },
  },
  async run(event) {
    const { body } = event;

    const eventType = body.eventType;
    const eventName = eventType.split(".")[0];

    this.$emit(body, {
      id: `${body.objectMetadata.id}-${body.eventDate}`,
      summary: `New ${body.objectMetadata.nameSingular} ${eventName}d with Id: ${body.objectMetadata.id}.`,
      ts: Date.parse(body.eventDate) || Date.now(),
    });
  },
  sampleEmit,
};
