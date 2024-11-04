import openphone from "../../openphone.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "openphone-new-call-recording-completed-instant",
  name: "New Call Recording Completed",
  description: "Emit a new event when a call recording has finished. [See the documentation](https://www.openphone.com/docs/api-reference/webhooks/create-a-new-webhook-for-calls)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    openphone,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    resourceIds: {
      propDefinition: [
        openphone,
        "resourceIds",
      ],
      optional: true,
    },
    label: {
      propDefinition: [
        openphone,
        "label",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const webhooks = await this.openphone.listWebhooks();
      for (const webhook of webhooks.slice(0, 50)) {
        this.$emit(webhook, {
          id: webhook.id,
          summary: `Webhook ID: ${webhook.id}`,
          ts: Date.parse(webhook.createdAt),
        });
      }
    },
    async activate() {
      const response = await this.openphone.createWebhook({
        url: this.http.endpoint,
        events: [
          "call.recording.completed",
        ],
        resourceIds: this.resourceIds,
        label: this.label,
      });
      this.setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.openphone.deleteWebhook(webhookId);
        this.setWebhookId(null);
      }
    },
  },
  methods: {
    getWebhookId() {
      return this.db.get("webhookId");
    },
    setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  async run(event) {
    const rawBody = event.bodyRaw;
    const secretKey = this.openphone.$auth.api_key;
    const webhookSignature = event.headers["x-openphone-signature"];

    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const data = event.body;
    this.$emit(data, {
      id: data.id,
      summary: `New call recording completed for call ID: ${data.callId}`,
      ts: Date.parse(data.completedAt),
    });
  },
};
