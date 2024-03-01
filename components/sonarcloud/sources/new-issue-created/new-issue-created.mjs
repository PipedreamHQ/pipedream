import sonarcloud from "../../sonarcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sonarcloud-new-issue-created",
  name: "New Issue Created",
  description: "Emit new event when a new issue is created in SonarCloud. [See the documentation](https://sonarcloud.io/web_api/api/issues)",
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
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // This is a placeholder to demonstrate how you might emit historical events.
      // SonarCloud does not provide an API to fetch issues by creation date directly.
      // You would need to implement logic here based on SonarCloud's API capabilities.
    },
    async activate() {
      // Create a webhook subscription
      const webhookUrl = `${this.http.endpoint}`;
      const createWebhookResponse = await this.sonarcloud.createWebhook({
        name: "Pipedream Webhook for New Issue Created",
        url: webhookUrl,
        secret: "optional-secret", // Adjust based on SonarCloud's requirements
      });
      this.db.set("webhookId", createWebhookResponse.id);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      await this.sonarcloud.deleteWebhook({
        id: webhookId,
      });
    },
  },
  async run(event) {
    const body = event.body;
    // Assuming the webhook event contains information about the issue
    if (body && body.issue) {
      this.$emit(body.issue, {
        id: body.issue.key, // Use a unique identifier for the issue
        summary: `New issue created: ${body.issue.message}`,
        ts: Date.parse(body.issue.creationDate) || Date.now(), // Use issue creation date or current time as fallback
      });
    }
  },
};
