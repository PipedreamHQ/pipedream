import { axios } from "@pipedream/platform";
import {
  createHmac, timingSafeEqual,
} from "node:crypto";
import {
  PRODUCTION_BASE_URL,
  SANDBOX_BASE_URL,
  WEBHOOK_SIGNATURE_TOLERANCE_SECONDS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "pdfgate",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "ID of an existing PDFGate document. You can map this from a previous step such as **Generate PDF** or **Upload File**.",
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "ID of an existing PDFGate envelope.",
    },
    preSignedUrlExpiresIn: {
      type: "integer",
      label: "Pre-Signed URL Expiry (seconds)",
      description: "Number of seconds the returned `fileUrl` remains valid. Allowed range: 60 to 86400 seconds. Defaults to 3600.",
      optional: true,
      min: 60,
      max: 86400,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Optional metadata as key-value pairs stored with the document. Example: `{\"customerId\":\"123\",\"invoiceId\":\"INV-001\"}`",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    /**
     * Keys starting with `test_` target the sandbox API; everything else is production.
     */
    _baseUrl() {
      const apiKey = this._apiKey() ?? "";
      return apiKey.startsWith("test_")
        ? SANDBOX_BASE_URL
        : PRODUCTION_BASE_URL;
    },
    _makeRequest({
      $ = this, path, headers = {}, ...opts
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
          ...headers,
        },
        ...opts,
      });
    },

    // ── Auth ──────────────────────────────────────────────────────────────
    checkAuth(args = {}) {
      return this._makeRequest({
        path: "/auth",
        ...args,
      });
    },

    // ── Documents ─────────────────────────────────────────────────────────
    generatePdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/generate/pdf",
        ...args,
      });
    },
    uploadFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/upload",
        ...args,
      });
    },
    getDocument({
      documentId, ...args
    }) {
      return this._makeRequest({
        path: `/document/${documentId}`,
        ...args,
      });
    },
    deleteDocument({
      documentId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/document/${documentId}`,
        ...args,
      });
    },
    compressPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/compress/pdf",
        ...args,
      });
    },
    flattenPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/flatten",
        ...args,
      });
    },
    extractFormData(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/extract-data",
        ...args,
      });
    },
    protectPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/protect/pdf",
        ...args,
      });
    },
    watermarkPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/watermark/pdf",
        ...args,
      });
    },

    // ── Envelopes ─────────────────────────────────────────────────────────
    createEnvelope(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/envelope",
        ...args,
      });
    },
    sendEnvelope({
      envelopeId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/envelope/${envelopeId}/send`,
        ...args,
      });
    },
    getEnvelope({
      envelopeId, ...args
    }) {
      return this._makeRequest({
        path: `/envelope/${envelopeId}`,
        ...args,
      });
    },

    // ── Webhooks ──────────────────────────────────────────────────────────
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
    /**
     * Verify a PDFGate webhook signature header of the form `t=<unix>,v1=<hex>`.
     * The signed payload is `${t}.${rawBody}` using HMAC-SHA256 with the webhook secret.
     * Returns true when at least one `v1` signature matches and the timestamp is fresh.
     */
    verifyWebhookSignature({
      secret, signatureHeader, payload, now = Math.floor(Date.now() / 1000),
    }) {
      if (!secret || !signatureHeader || payload === undefined || payload === null) {
        return false;
      }
      let timestamp = null;
      const signatures = [];
      for (const part of String(signatureHeader).split(",")) {
        const eqIdx = part.indexOf("=");
        if (eqIdx === -1) continue;
        const key = part.slice(0, eqIdx).trim();
        const value = part.slice(eqIdx + 1).trim();
        if (key === "t" && value) timestamp = Number(value);
        if (key === "v1" && value) signatures.push(value);
      }
      if (!timestamp || Number.isNaN(timestamp) || signatures.length === 0) {
        return false;
      }
      if (Math.abs(now - timestamp) > WEBHOOK_SIGNATURE_TOLERANCE_SECONDS) {
        return false;
      }
      const expected = createHmac("sha256", secret)
        .update(`${timestamp}.${payload}`)
        .digest("hex");
      const expectedBuf = Buffer.from(expected, "hex");
      return signatures.some((sig) => {
        try {
          const sigBuf = Buffer.from(sig, "hex");
          return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
        } catch {
          return false;
        }
      });
    },
  },
};
