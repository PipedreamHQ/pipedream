import reachmail from "../../reachmail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "reachmail-new-bounce-instant",
  name: "New Bounce Instant",
  description: "Emit new event when a recipient's email address bounces.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    reachmail: {
      type: "app",
      app: "reachmail",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const bounces = await this.reachmail.getBounces({
        max: 50,
      });
      for (const bounce of bounces) {
        this.$emit(bounce, {
          id: bounce.id,
          summary: `New bounce: ${bounce.email}`,
          ts: Date.parse(bounce.timestamp),
        });
      }
    },
    async activate() {
      const webhookId = await this.reachmail.createWebhookSubscription({
        eventType: "bounce",
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.reachmail.deleteWebhookSubscription({
        webhookId,
      });
    },
  },
  async run(event) {
    const bounce = event.body;
    this.$emit(bounce, {
      id: bounce.id,
      summary: `New bounce: ${bounce.email}`,
      ts: Date.parse(bounce.timestamp),
    });
  },
};
