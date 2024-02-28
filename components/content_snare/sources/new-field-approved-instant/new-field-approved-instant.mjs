import contentSnare from "../../content_snare.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "content_snare-new-field-approved-instant",
  name: "New Field Approved (Instant)",
  description: "Emits an event when a field is approved in Content Snare. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentSnare,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    requestId: {
      propDefinition: [
        contentSnare,
        "requestId",
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
    verifySignature(signature, body, secret) {
      const expectedSignature = this.generateSignature(body, secret);
      return expectedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      const fields = await this.contentSnare.listFields({ requestId: this.requestId });
      const approvedFields = fields.filter((field) => field.status === "approved").slice(-50);
      for (const field of approvedFields) {
        this.$emit(field, {
          id: field.id,
          summary: `Field approved: ${field.label}`,
          ts: Date.parse(field.updated_at),
        });
      }
    },
    async activate() {
      // Placeholder for webhook creation logic
      // Save the webhook ID to the component state for later use in deactivate
      const webhookId = "your-webhook-id"; // Replace with actual ID from API response
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.contentSnare.deleteWebhook(webhookId);
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const { body, headers } = event;
    const signatureHeaderName = "X-Content-Snare-Signature";
    const signature = headers[signatureHeaderName];
    const secret = this.contentSnare.$auth.oauth_access_token;

    if (!this.verifySignature(signature, JSON.stringify(body), secret)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (body.field && body.field.status === "approved") {
      this.$emit(body.field, {
        id: body.field.id,
        summary: `Field approved: ${body.field.label}`,
        ts: Date.parse(body.field.updated_at),
      });
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};