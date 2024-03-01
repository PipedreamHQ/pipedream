import sonarcloud from "../../sonarcloud.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sonarcloud-new-issue-changed",
  name: "New Issue Changed",
  description: "Emit new event when a new issue is updated. [See the documentation](https://sonarcloud.io/web_api)",
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
      // Fetch and emit the last 50 updated issues
      const issues = await this.sonarcloud.getRecentlyUpdatedIssues({
        max: 50,
      });
      issues.forEach((issue) => {
        this.$emit(issue, {
          id: issue.key,
          summary: `Issue Updated: ${issue.key}`,
          ts: issue.ts
            ? Date.parse(issue.ts)
            : Date.now(),
        });
      });
    },
    async activate() {
      const webhookUrl = `${this.http.endpoint}`;
      const webhookOpts = {
        name: "Pipedream Webhook",
        url: webhookUrl,
        secret: "optional-secret", // Adjust based on actual API requirements
      };
      const webhookId = await this.sonarcloud.createWebhook(webhookOpts);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.sonarcloud.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    // Example validation (adjust based on actual API requirements)
    // const computedSignature = crypto.createHmac("sha256", "your-secret").update(JSON.stringify(body)).digest("hex");
    // if (headers["x-webhook-signature"] !== computedSignature) {
    //   this.http.respond({ status: 401, body: "Unauthorized" });
    //   return;
    // }

    try {
      const issueUpdated = JSON.parse(body);
      if (issueUpdated && issueUpdated.issue) {
        this.$emit(issueUpdated.issue, {
          id: issueUpdated.issue.key,
          summary: `Issue updated: ${issueUpdated.issue.key}`,
          ts: issueUpdated.issue.ts
            ? Date.parse(issueUpdated.issue.ts)
            : Date.now(),
        });
      } else {
        this.http.respond({
          status: 400,
          body: "No issue data found in webhook payload",
        });
      }
    } catch (error) {
      this.http.respond({
        status: 500,
        body: `Error processing event: ${error.message}`,
      });
    }
  },
};
