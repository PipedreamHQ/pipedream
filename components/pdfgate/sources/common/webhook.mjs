import app from "../../pdfgate.app.mjs";
import { WEBHOOK_SIGNATURE_HEADER } from "../../common/constants.mjs";
import { verifyWebhookSignature } from "../../common/utils.mjs";

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
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookSecret() {
      return this.db.get("webhookSecret");
    },
    _setWebhookSecret(secret) {
      this.db.set("webhookSecret", secret);
    },
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
    /**
     * Fail closed: without a stored secret no delivery can be trusted.
     */
    isValidSignature(event) {
      const secret = this._getWebhookSecret();
      if (!secret) {
        return false;
      }
      const payload = event.bodyRaw ?? JSON.stringify(event.body ?? {});
      return verifyWebhookSignature({
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
      if (!response?.id || !response?.secret) {
        throw new Error("PDFGate did not return a webhook id and signing secret; cannot verify deliveries.");
      }
      this._setWebhookId(response.id);
      this._setWebhookSecret(response.secret);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (!webhookId) {
        return;
      }
      try {
        await this.app.deleteWebhook({
          webhookId,
        });
      } catch (error) {
        if (error?.response?.status !== 404) {
          // Keep the stored id so the registration can still be cleaned up later.
          throw error;
        }
        // Already gone on the PDFGate side; treat as deleted.
      }
      this._setWebhookId(null);
      this._setWebhookSecret(null);
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
