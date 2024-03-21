import cloudConvertApp from "../../cloud_convert.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "cloud_convert-job-failed-instant",
  name: "Job Failed (Instant)",
  description: "Emits an event when a CloudConvert job has failed. [See the documentation](https://cloudconvert.com/api/v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cloudConvertApp,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    jobId: {
      propDefinition: [
        cloudConvertApp,
        "jobId",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  methods: {
    generateSignature(body, secret) {
      return crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("hex");
    },
  },
  hooks: {
    async activate() {
      const webhookData = {
        url: this.http.endpoint,
        events: [
          "job.failed",
        ],
      };
      const { data } = await this.cloudConvertApp.createWebhook(webhookData);
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.cloudConvertApp.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const signature = headers["cloudconvert-signature"];
    const signingSecret = this.cloudConvertApp.$auth.oauth_access_token;
    const computedSignature = this.generateSignature(body, signingSecret);

    if (signature !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    // Emit the event if the job ID matches the configured job ID or if no job ID is configured
    if (!this.jobId || body.job.id === this.jobId) {
      this.$emit(body, {
        id: body.job.id,
        summary: `Job ${body.job.id} failed`,
        ts: Date.parse(body.job.created_at),
      });
    }

    this.http.respond({
      status: 200,
    });
  },
};
