import { axios } from "@pipedream/platform";
import {
  DEFAULT_BASE_URL,
  DELIVERY_MODES,
  EINVOICE_PROFILES,
  EINVOICE_STANDARDS,
  IMAGE_TYPES,
  PAGE_FORMATS,
  SCREENSHOT_CONVERT_PATH,
  SCREENSHOT_OUTPUT_ENCODINGS,
  SOURCE_TYPES,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "polydoc",
  propDefinitions: {
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "Where the content to render comes from.",
      options: SOURCE_TYPES,
      default: "url",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The web page to render. Used when Source Type is `url`.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "Inline HTML to render. Used when Source Type is `html`.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "ID of a template saved in PolyDoc (for example `jlE-whg`). Used when Source Type is `template`.",
      optional: true,
    },
    templateData: {
      type: "object",
      label: "Template Data",
      description: "Key-value data passed to the Liquid template renderer. Example: `{ \"customerName\": \"Ada Lovelace\", \"invoiceNumber\": \"INV-1001\" }`. Used when Source Type is `template`.",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Output filename, used in the file written for download delivery.",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "A short label (max 30 chars) for logging and analytics.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout (ms)",
      description: "Conversion timeout in milliseconds. The free tier is capped at 30000.",
      optional: true,
    },
    deliveryMode: {
      type: "string",
      label: "Delivery Mode",
      description: "How the result is delivered.",
      options: DELIVERY_MODES,
      default: "download",
    },
    presignedUrl: {
      type: "string",
      label: "Presigned URL",
      description: "A presigned upload URL (S3 / GCS / Azure). Used when Delivery Mode is `cloudStorage`.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL the file is delivered to. Used when Delivery Mode is `webhook`.",
      optional: true,
    },
    webhookOptions: {
      type: "object",
      label: "Webhook Options",
      description: "Optional webhook settings. Example: `{ \"async\": true, \"method\": \"POST\", \"headers\": { \"X-Signature\": \"abc123\" }, \"retries\": 3, \"retryDelay\": 1000, \"timeout\": 10000 }`.",
      optional: true,
    },
    advanced: {
      type: "object",
      label: "Advanced (JSON)",
      description: "Raw object deep-merged into the request body for any API field not exposed above (for example `pdf.watermark`, `pdf.pdfa`, `render`, `request`). Advanced values win on conflict.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Page Format",
      description: "Paper format for the PDF.",
      options: PAGE_FORMATS,
      optional: true,
      default: "A4",
    },
    landscape: {
      type: "boolean",
      label: "Landscape",
      description: "Render in landscape orientation.",
      optional: true,
    },
    printBackground: {
      type: "boolean",
      label: "Print Background",
      description: "Include background graphics.",
      optional: true,
      default: true,
    },
    pageRanges: {
      type: "string",
      label: "Page Ranges",
      description: "Pages to include, for example `1-5, 8, 11-13`.",
      optional: true,
    },
    outline: {
      type: "boolean",
      label: "Outline",
      description: "Generate PDF bookmarks from HTML headings.",
      optional: true,
    },
    tagged: {
      type: "boolean",
      label: "Tagged PDF",
      description: "Produce an accessible (tagged) PDF.",
      optional: true,
    },
    scale: {
      type: "string",
      label: "Scale",
      description: "Render scale between 0.1 and 2 (for example `0.8`).",
      optional: true,
    },
    marginTop: {
      type: "string",
      label: "Margin Top",
      description: "Top margin, for example `10mm`.",
      optional: true,
    },
    marginRight: {
      type: "string",
      label: "Margin Right",
      description: "Right margin, for example `10mm`.",
      optional: true,
    },
    marginBottom: {
      type: "string",
      label: "Margin Bottom",
      description: "Bottom margin, for example `10mm`.",
      optional: true,
    },
    marginLeft: {
      type: "string",
      label: "Margin Left",
      description: "Left margin, for example `10mm`.",
      optional: true,
    },
    imageType: {
      type: "string",
      label: "Image Type",
      description: "Screenshot image format.",
      options: IMAGE_TYPES,
      optional: true,
      default: "png",
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Capture the entire scrollable page.",
      optional: true,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Compression quality 0-100 for JPEG / WebP.",
      optional: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "Viewport width in pixels.",
      optional: true,
      default: 1280,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "Viewport height in pixels.",
      optional: true,
      default: 800,
    },
    devicePixelRatio: {
      type: "integer",
      label: "Device Pixel Ratio",
      description: "Device pixel ratio (0-10).",
      optional: true,
    },
    outputEncoding: {
      type: "string",
      label: "Output Encoding",
      description: "Return the screenshot as a binary file or a base64 string.",
      options: SCREENSHOT_OUTPUT_ENCODINGS,
      optional: true,
      default: "binaryFile",
    },
    eInvoiceStandard: {
      type: "string",
      label: "Standard",
      description: "E-invoice standard.",
      options: EINVOICE_STANDARDS,
      default: "zugferd",
    },
    eInvoiceProfile: {
      type: "string",
      label: "Profile",
      description: "E-invoice profile. `en16931` is the EU-standard profile.",
      options: EINVOICE_PROFILES,
      default: "en16931",
    },
    invoice: {
      type: "object",
      label: "Invoice",
      description: "Structured invoice data (EN 16931). Example: `{ \"number\": \"INV-1001\", \"issueDate\": \"2026-06-16\", \"currencyCode\": \"EUR\", \"seller\": { \"name\": \"Acme GmbH\" }, \"buyer\": { \"name\": \"Example SARL\" }, \"lines\": [{ \"name\": \"Consulting\", \"quantity\": 1, \"unitPrice\": 100 }], \"totalNetAmount\": 100, \"totalTaxAmount\": 20, \"totalGrossAmount\": 120 }`. Requires at minimum `number`, `issueDate`, `currencyCode`, `seller`, `buyer`, `lines`, and the `totalNetAmount` / `totalTaxAmount` / `totalGrossAmount` totals. Include `dueDate` or `paymentTerms` to satisfy validation.",
    },
    eInvoiceVerify: {
      type: "boolean",
      label: "Verify",
      description: "Verify PDF/A and e-invoice compliance during generation.",
      optional: true,
      default: false,
    },
  },
  methods: {
    /** The PolyDoc API base URL with any trailing slashes trimmed. */
    _baseUrl() {
      return DEFAULT_BASE_URL.replace(/\/+$/, "");
    },
    /**
     * Request headers: JSON content type, Bearer auth, and the per-request
     * X-Sandbox flag taken from the connected account.
     */
    _headers(extra = {}) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "X-Sandbox": this.$auth.sandbox
          ? "true"
          : "false",
        ...extra,
      };
    },
    /**
     * Authenticated POST to a PolyDoc endpoint. Returns the full response so the
     * caller can read binary bytes plus headers, or parse the JSON delivery
     * confirmation. `X-Sandbox` is set per-request from the connected account.
     */
    async _request({
      $, endpoint, body, isBinary = false, headers = {},
    }) {
      const config = {
        method: "POST",
        url: `${this._baseUrl()}${endpoint}`,
        headers: this._headers(headers),
        data: body,
        returnFullResponse: true,
      };
      if (isBinary) {
        config.responseType = "arraybuffer";
      }
      return axios($ ?? this, config);
    },
    /**
     * Validate the connected API key with a tiny sandbox screenshot. Forced to
     * sandbox so it never consumes production quota. 200 on a valid key, 401 on
     * an invalid one.
     */
    async testConnection($) {
      return this._request({
        $,
        endpoint: SCREENSHOT_CONVERT_PATH,
        body: {
          source: "<p>polydoc</p>",
          screenshot: {
            type: "png",
          },
        },
        isBinary: true,
        headers: {
          "X-Sandbox": "true",
        },
      });
    },
  },
};
