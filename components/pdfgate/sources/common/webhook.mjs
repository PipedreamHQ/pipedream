import app from "../../pdfgate.app.mjs";
import { WEBHOOK_SIGNATURE_HEADER } from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    getEventType() {
      throw new Error("getEventType() is not implemented for this source");
    },
    getSummary(body) {
      const envelopeId = body?.data?.envelope?.id ?? body?.resource?.id ?? "unknown";
      return `${this.getEventType()}: envelope ${envelopeId}`;
    },
    getEventId(body) {
      if (body?.eventId) {
        return body.eventId;
      }
      const resourceId = body?.resource?.id ?? body?.data?.envelope?.id ?? "unknown";
      return `${body?.event ?? this.getEventType()}-${resourceId}-${body?.timestamp ?? Date.now()}`;
    },
    getEventTimestamp(body) {
      const parsed = body?.timestamp
        ? Date.parse(body.timestamp)
        : NaN;
      return Number.isNaN(parsed)
        ? Date.now()
        : parsed;
    },
    getSignatureHeader(headers = {}) {
      const match = Object.keys(headers).find(
        (key) => key.toLowerCase() === WEBHOOK_SIGNATURE_HEADER,
      );
      return match
        ? headers[match]
        : undefined;
    },
    isValidSignature(event) {
      const secret = this.db.get("webhookSecret");
      if (!secret) {
        // Webhook was registered without a secret; nothing to verify against.
        return true;
      }
      const payload = event.bodyRaw ?? JSON.stringify(event.body ?? {});
      return this.app.verifyWebhookSignature({
        secret,
        signatureHeader: this.getSignatureHeader(event.headers),
        payload,
      });
    },
  },
  hooks: {
    async activate() {
      const response = await this.app.createWebhook({
        data: {
          url: this.http.endpoint,
          eventTypes: [
            this.getEventType(),
          ],
        },
      });
      this.db.set("webhookId", response.id);
      this.db.set("webhookSecret", response.secret);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        try {
          await this.app.deleteWebhook({
            webhookId,
          });
        } catch (error) {
          // Cleanup is best-effort: the webhook may already have been removed.
          console.log(`PDFGate webhook ${webhookId} deregistration failed: ${error?.message ?? error}`);
        }
      }
      this.db.set("webhookId", null);
      this.db.set("webhookSecret", null);
    },
  },
  async run(event) {
    if (!this.isValidSignature(event)) {
      this.http.respond({
        status: 401,
        body: "Invalid webhook signature",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    const body = event.body;
    if (!body || body.event !== this.getEventType()) {
      return;
    }

    this.$emit(body, {
      id: this.getEventId(body),
      summary: this.getSummary(body),
      ts: this.getEventTimestamp(body),
    });
  },
};
