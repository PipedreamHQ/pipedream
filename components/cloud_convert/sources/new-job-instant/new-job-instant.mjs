import cloudConvert from "../../cloud_convert.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cloud_convert-new-job-instant",
  name: "New Job Instant",
  description: "Emits an event when a new job has been created. [See the documentation](https://cloudconvert.com/api/v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cloudConvert: {
      type: "app",
      app: "cloud_convert",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const events = [
        "job.created",
      ];

      const webhook = await this.cloudConvert.createWebhook({
        url: webhookUrl,
        events,
      });

      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.cloudConvert.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the webhook signature if applicable
    if (headers["CloudConvert-Signature"]) {
      const secret = this.cloudConvert.$auth.oauth_access_token;
      const computedSignature = crypto.createHmac("sha256", secret).update(JSON.stringify(body))
        .digest("hex");
      if (headers["CloudConvert-Signature"] !== computedSignature) {
        this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
        return;
      }
    }

    if (body.event === "job.created") {
      this.$emit(body, {
        id: body.job.id,
        summary: `New Job Created: ${body.job.id}`,
        ts: Date.parse(body.job.created_at),
      });
    } else {
      this.http.respond({
        status: 404,
        body: "Event type not supported",
      });
    }
  },
};
