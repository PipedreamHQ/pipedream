import sonarcloud from "../../sonarcloud.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "sonarcloud-new-issue-resolved",
  name: "New Issue Resolved",
  description: "Emit new event when a new issue is set as resolved. [See the documentation](https://sonarcloud.io/web_api)",
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
    async activate() {
      const webhookUrl = `${this.http.endpoint}`;
      const opts = {
        data: {
          name: "Pipedream - New Issue Resolved",
          url: webhookUrl,
          secret: "optional-secret", // Adjust according to SonarCloud's requirements
        },
      };
      const { webhookId } = await this.sonarcloud.createWebhook(opts);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) return;
      await this.sonarcloud.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const body = event.body;
    const headers = event.headers;
    const secretKey = "optional-secret"; // Adjust according to SonarCloud's requirements
    const signature = headers["x-sonar-webhook-signature"];
    const computedSignature = crypto.createHmac("sha256", secretKey).update(JSON.stringify(body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (body.action === "resolved") { // Assuming 'action' field indicates issue resolution
      this.$emit(body, {
        id: body.issueId, // Assuming 'issueId' is a unique identifier for the issue
        summary: `Issue ${body.issueId} resolved`,
        ts: Date.parse(body.resolvedAt), // Assuming 'resolvedAt' contains the timestamp of resolution
      });
    }
  },
};
