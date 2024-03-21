import cloudConvert from "../../cloud_convert.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "cloud_convert-job-finished-instant",
  name: "Job Finished (Instant)",
  description: "Emits an event when a CloudConvert job has been completed. [See the documentation](https://cloudconvert.com/api/v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cloudConvert,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const webhooks = await this.cloudConvert.listWebhooks();
      const existingWebhook = webhooks.find((webhook) => webhook.url === this.http.endpoint);
      if (existingWebhook) {
        this.db.set("webhookId", existingWebhook.id);
      } else {
        const { data } = await this.cloudConvert.createWebhook({
          url: this.http.endpoint,
          events: [
            "job.finished",
          ],
        });
        this.db.set("webhookId", data.id);
      }
    },
    async activate() {
      // This hook is intentionally left empty since the deploy hook already handles webhook creation
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.cloudConvert.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate webhook signature
    const signature = headers["cloudconvert-signature"];
    const signingSecret = this.cloudConvert.$auth.signing_secret;
    const computedSignature = crypto
      .createHmac("sha256", signingSecret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    // Emit the event data
    this.$emit(body, {
      id: body.job.id,
      summary: `Job ${body.job.id} finished`,
      ts: Date.parse(body.job.ended_at),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};
