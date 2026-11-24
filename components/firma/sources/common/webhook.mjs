import {
  createHmac,
  timingSafeEqual,
} from "crypto";
import firma from "../../firma.app.mjs";
import {
  SIGNATURE_HEADER,
  SIGNATURE_OLD_HEADER,
} from "../../common/constants.mjs";

export default {
  props: {
    firma,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The UUID of a Firma workspace, for example `0b7c1f7e-2d4a-4b8e-9f3c-6a5d4e3c2b1a`, to register a workspace webhook that receives only that workspace's events. When omitted, a company webhook is registered. Webhooks must be switched on for the company or the workspace in the Firma dashboard (Settings, Webhooks), otherwise Firma sends no events.",
      optional: true,
    },
    webhookSecret: {
      type: "string",
      label: "Webhook Signing Secret",
      description: "The webhook signing secret of the company, or of the workspace when **Workspace ID** is set, from the Firma dashboard (Settings, Webhooks). When set, every delivery must carry a valid `X-Firma-Signature` header; others are answered with 401 and not emitted. Strongly recommended.",
      secret: true,
      optional: true,
    },
  },
  methods: {
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    /**
     * Checks one `X-Firma-Signature` value (`t=<unix seconds>,v1=<hex>`): an HMAC-SHA256
     * of `<t>.<raw body>` with the signing secret.
     * @param {string} header The header value
     * @param {string} bodyRaw The raw request body
     * @returns {boolean}
     */
    _isSignatureValid(header, bodyRaw) {
      if (!header || typeof bodyRaw !== "string") {
        return false;
      }
      const parts = Object.fromEntries(header.split(",").map((part) => {
        const index = part.indexOf("=");
        return [
          part.slice(0, index).trim(),
          part.slice(index + 1).trim(),
        ];
      }));
      if (!parts.t || !/^[0-9a-f]{64}$/i.test(parts.v1 || "")) {
        return false;
      }
      const expected = createHmac("sha256", this.webhookSecret)
        .update(`${parts.t}.${bodyRaw}`)
        .digest();
      return timingSafeEqual(Buffer.from(parts.v1, "hex"), expected);
    },
    /**
     * Accepts a delivery signed with the current secret, or with the previous one during
     * the 7 days after a secret rotation (`X-Firma-Signature-Old`).
     * @param {object} event The HTTP event
     * @returns {boolean}
     */
    isAuthentic({
      headers = {}, bodyRaw,
    }) {
      if (!this.webhookSecret) {
        return true;
      }
      return this._isSignatureValid(headers[SIGNATURE_HEADER], bodyRaw)
        || this._isSignatureValid(headers[SIGNATURE_OLD_HEADER], bodyRaw);
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: this.getSummary(body),
        ts: Date.parse(body.created_at) || Date.now(),
      };
    },
  },
  hooks: {
    async activate() {
      const response = await this.firma.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEventTypes(),
          workspace_id: this.workspaceId,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.firma.deleteWebhook({
          webhookId,
        });
        this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    if (!this.isAuthentic(event)) {
      this.http.respond({
        status: 401,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    const { body } = event;
    if (!body?.id || !this.getEventTypes().includes(body.type)) {
      return;
    }
    // Firma retries a failed delivery with the same payload, so its top-level `id`
    // de-duplicates retries.
    this.$emit(body, this.generateMeta(body));
  },
};
