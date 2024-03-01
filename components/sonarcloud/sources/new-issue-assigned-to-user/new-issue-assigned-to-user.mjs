import sonarcloud from "../../sonarcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sonarcloud-new-issue-assigned-to-user",
  name: "New Issue Assigned to User",
  description: "Emit new event when an issue is assigned to a user. [See the documentation](https://sonarcloud.io/web_api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sonarcloud: {
      type: "app",
      app: "sonarcloud",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // This hook can be used to initialize or fetch historical data if needed.
      // For this component, there's no historical data fetching as it's event-driven.
    },
    async activate() {
      const webhookUrl = `${this.http.endpoint}`;
      const opts = {
        name: "Pipedream Webhook for New Issue Assigned",
        url: webhookUrl,
        secret: "optional-secret", // Adjust based on actual API requirements for securing webhooks
      };
      const webhookId = await this.sonarcloud.createWebhook(opts);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.sonarcloud.deleteWebhook({
          id: webhookId,
        });
      }
    },
  },
  async run(event) {
    const eventData = event.body;
    if (!eventData) {
      this.http.respond({
        status: 400,
        body: "No event data found",
      });
      return;
    }

    // Emitting the entire event data for simplicity, adjust based on actual requirements
    this.$emit(eventData, {
      id: eventData.id || `${Date.now()}`, // Using Date.now() as a fallback if no unique ID is present in the event
      summary: `New issue assigned to user: ${eventData.assignee}`,
      ts: eventData.timestamp
        ? Date.parse(eventData.timestamp)
        : Date.now(), // Using event timestamp or current time as a fallback
    });

    // Responding to the webhook sender to acknowledge receipt
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
