import { axios } from "@pipedream/platform";
import {
  PRODUCTION_BASE_URL,
  SANDBOX_BASE_URL,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "pdfgate",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "ID of an existing PDFGate document, e.g. `6acf40d909b3df0f91f8f00b`. Use **Generate PDF** or **Upload File** and read the `id` field of the response, or use **Get Document** to look one up.",
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "ID of an existing PDFGate envelope, e.g. `6ae0390df164e22d4bd5f5da`. Use **Create Envelope** and read the `id` field of the response.",
    },
    preSignedUrlExpiresIn: {
      type: "integer",
      label: "Pre-Signed URL Expiry (seconds)",
      description: "Number of seconds the returned `fileUrl` download link stays valid, e.g. `3600`. Allowed range: `60` to `86400`. Set it to receive a `fileUrl` in the response; when omitted no download link is returned. Requires document storage to be enabled in the PDFGate dashboard.",
      optional: true,
      min: 60,
      max: 86400,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Optional key-value pairs stored with the document and returned on later reads, e.g. `{\"customerId\":\"123\",\"invoiceId\":\"INV-001\"}`.",
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
    /**
     * Validate the connected API key.
     */
    checkAuth(args = {}) {
      return this._makeRequest({
        path: "/auth",
        ...args,
      });
    },

    // ── Documents ─────────────────────────────────────────────────────────
    /**
     * Render a PDF from a URL or HTML. Returns the document object.
     */
    generatePdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/generate/pdf",
        ...args,
      });
    },
    /**
     * Store a PDF fetched from a public URL. Returns the document object.
     */
    uploadFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/upload",
        ...args,
      });
    },
    /**
     * Fetch a stored document by id. Pass `params.preSignedUrlExpiresIn` to get a `fileUrl`.
     */
    getDocument({
      documentId, ...args
    }) {
      return this._makeRequest({
        path: `/document/${documentId}`,
        ...args,
      });
    },
    /**
     * Permanently delete a stored document.
     */
    deleteDocument({
      documentId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/document/${documentId}`,
        ...args,
      });
    },
    /**
     * Compress a stored PDF into a new document.
     */
    compressPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/compress/pdf",
        ...args,
      });
    },
    /**
     * Flatten form fields of a stored PDF into a new document.
     */
    flattenPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/flatten",
        ...args,
      });
    },
    /**
     * Read form field values from a stored fillable PDF.
     */
    extractFormData(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/forms/extract-data",
        ...args,
      });
    },
    /**
     * Encrypt a stored PDF into a new document.
     */
    protectPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/protect/pdf",
        ...args,
      });
    },
    /**
     * Apply a text watermark to a stored PDF, producing a new document.
     */
    watermarkPdf(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/watermark/pdf",
        ...args,
      });
    },

    // ── Envelopes ─────────────────────────────────────────────────────────
    /**
     * Create a signing envelope from stored documents.
     */
    createEnvelope(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/envelope",
        ...args,
      });
    },
    /**
     * Email signing links to an envelope's recipients.
     */
    sendEnvelope({
      envelopeId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/envelope/${envelopeId}/send`,
        ...args,
      });
    },
    /**
     * Fetch an envelope with its documents and recipient statuses.
     */
    getEnvelope({
      envelopeId, ...args
    }) {
      return this._makeRequest({
        path: `/envelope/${envelopeId}`,
        ...args,
      });
    },

    // ── Webhooks ──────────────────────────────────────────────────────────
    /**
     * Register a webhook. Returns `{ id, secret, ... }`; the secret signs deliveries.
     */
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...args,
      });
    },
    /**
     * Remove a webhook registration.
     */
    deleteWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
  },
};
