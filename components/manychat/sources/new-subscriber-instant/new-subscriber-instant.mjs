import { axios } from "@pipedream/platform";
import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-new-subscriber-instant",
  name: "New Subscriber (Instant)",
  description: "Emit new event when a user subscribes to your page. [See the documentation]()", // Placeholder for documentation link
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    manychat,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.manychat.createWebhook({
        event: "subscriber_added",
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.manychat.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const { body } = event;

    if (body && body.subscriber_id) {
      this.$emit(body, {
        id: body.subscriber_id,
        summary: `New subscriber with ID: ${body.subscriber_id}`,
        ts: Date.now(),
      });
    }

    this.http.respond({
      status: 200,
      body: "",
    });
  },
};
