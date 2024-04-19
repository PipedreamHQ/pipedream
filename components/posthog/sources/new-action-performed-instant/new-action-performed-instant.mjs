import { axios } from "@pipedream/platform";
import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-new-action-performed-instant",
  name: "New Action Performed Instant",
  description: "Emit new event when an action is performed by a user. [See the documentation](https://posthog.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    posthog: {
      type: "app",
      app: "posthog",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.posthog.createWebhook();
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.posthog.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["X-PostHog-Signature"] !== this.posthog.$auth.api_key) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: body.distinct_id,
      summary: `New action performed: ${body.event}`,
      ts: Date.now(),
    });
  },
};
