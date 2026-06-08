import fs from "fs";
import { axios, ConfigurationError } from "@pipedream/platform";
import {
  BASE_URL,
  PDFA_OPTIONS,
  CONFIG_ERROR_CODES,
  friendlyMessage,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "filetopdf",
  propDefinitions: {
    // ---- Layout / rendering options (the "advanced" group). ----
    // Labels + help copy are reused verbatim from the Zapier/Make/n8n integrations
    // so every FileToPDF connector reads the same. These conversion parameters
    // require Pro, Scale, or the free trial — on Starter/Basic the API returns
    // 402 upgrade_required (surfaced as a clear error). Values are sent as strings.
    landscape: {
      type: "boolean",
      label: "Landscape Orientation",
      description: "Render the page in landscape orientation.",
      optional: true,
    },
    paperWidth: {
      type: "string",
      label: "Paper Width (Inches)",
      description: "Default 8.5 (Letter). A4 is 8.27.",
      optional: true,
    },
    paperHeight: {
      type: "string",
      label: "Paper Height (Inches)",
      description: "Default 11 (Letter). A4 is 11.7.",
      optional: true,
    },
    marginTop: {
      type: "string",
      label: "Margin Top (Inches)",
      description: "Top page margin in inches.",
      optional: true,
    },
    marginBottom: {
      type: "string",
      label: "Margin Bottom (Inches)",
      description: "Bottom page margin in inches.",
      optional: true,
    },
    marginLeft: {
      type: "string",
      label: "Margin Left (Inches)",
      description: "Left page margin in inches.",
      optional: true,
    },
    marginRight: {
      type: "string",
      label: "Margin Right (Inches)",
      description: "Right page margin in inches.",
      optional: true,
    },
    scale: {
      type: "string",
      label: "Scale",
      description: "Render scale, e.g. 0.8 to shrink content. Default 1.",
      optional: true,
    },
    printBackground: {
      type: "boolean",
      label: "Print Background Graphics",
      description: "Include background colors and images in the PDF.",
      optional: true,
    },
    preferCssPageSize: {
      type: "boolean",
      label: "Prefer CSS @page Size",
      description: "Use the page size declared in the document's CSS @page rules.",
      optional: true,
    },
    nativePageRanges: {
      type: "string",
      label: "Page Ranges",
      description: "Limit output to specific pages, e.g. `1-3` or `2,5-7`.",
      optional: true,
    },
    pdfa: {
      type: "string",
      label: "PDF/A Archival Format",
      description: "Produce an ISO-standardised archival PDF.",
      options: PDFA_OPTIONS,
      optional: true,
    },
    pdfua: {
      type: "boolean",
      label: "PDF/UA (Accessibility)",
      description: "Produce an accessible, tagged PDF/UA document.",
      optional: true,
    },
    sourcePassword: {
      type: "string",
      label: "Source Document Password",
      description: "Password to open a protected source document (office files only).",
      optional: true,
      secret: true,
    },
    userPassword: {
      type: "string",
      label: "Output Open Password",
      description: "Encrypt the resulting PDF; this password is required to open it.",
      optional: true,
      secret: true,
    },
    ownerPassword: {
      type: "string",
      label: "Output Permissions Password",
      description: "Restrict editing/printing of the resulting PDF.",
      optional: true,
      secret: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _headers(extra = {}) {
      return {
        "x-api-key": this._apiKey(),
        // Ask for the base64 JSON envelope so we get the PDF plus metadata in one
        // response; we decode it to a real file in /tmp for downstream steps.
        "Accept": "application/json",
        ...extra,
      };
    },
    /**
     * Coerce option values to the strings the API/Gotenberg expects — the backend's
     * form handling chokes on raw booleans/numbers — and drop anything unset.
     * The neutral `sourcePassword` key maps back to the API's `password` parameter.
     */
    stringifyOptions(options = {}) {
      const ALIASES = { sourcePassword: "password" };
      const out = {};
      for (const [key, value] of Object.entries(options)) {
        if (value === undefined || value === null || value === "") continue;
        out[ALIASES[key] || key] = typeof value === "boolean" ? String(value) : String(value);
      }
      return out;
    },
    async _request($, config) {
      try {
        return await axios($, {
          baseURL: BASE_URL,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          ...config,
          headers: this._headers(config.headers),
        });
      } catch (err) {
        this._throwFriendly(err);
      }
    },
    /** Map the API's `{ error: { code, message } }` envelope to a clean Pipedream error. */
    _throwFriendly(err) {
      // Transport-level failures (timeout, DNS, TLS, connection reset) carry no
      // HTTP response / API envelope — surface the real error instead of a
      // misleading message with an undefined status.
      if (err && !err.response) {
        throw new Error(`Could not reach FileToPDF: ${(err && err.message) || err}`);
      }
      const status = err && err.response && err.response.status;
      const envelope = (err && err.response && err.response.data) || {};
      const error = envelope.error || {};
      const code = error.code || "error";
      const message = `${friendlyMessage(code, error, status)} (${code})`;
      if (CONFIG_ERROR_CODES.has(code)) {
        throw new ConfigurationError(message);
      }
      throw new Error(message);
    },
    /** Connection test + balance check. Free, never rate-limited. */
    getAccount($) {
      return this._request($, {
        method: "GET",
        url: "/account",
      });
    },
    /** JSON-body conversion (HTML, Markdown, or file-from-URL). */
    convertJson($, path, data) {
      return this._request($, {
        method: "POST",
        url: path,
        data,
      });
    },
    /** Multipart conversion with an uploaded file (form-data instance). */
    convertMultipart($, path, form) {
      return this._request($, {
        method: "POST",
        url: path,
        data: form,
        headers: form.getHeaders(),
      });
    },
    /**
     * Decode a successful JSON envelope's base64 PDF into a real file in /tmp so
     * downstream steps (Drive, Dropbox, Email…) can consume it, and return the
     * file path plus friendly metadata. /tmp-path-return is the registry convention.
     */
    async writePdfToTmp(envelope) {
      const data = envelope && envelope.data;
      if (!data || !data.pdf) {
        throw new Error("The API response did not contain a PDF.");
      }
      let safeName = String(data.filename || "converted.pdf").split(/[\\/]/).pop() || "converted.pdf";
      // Guard against dot-only names ("." / "..") that would resolve to /tmp
      // itself or its parent and break the write.
      if (safeName === "." || safeName === "..") {
        safeName = "converted.pdf";
      }
      const filePath = `/tmp/${safeName}`;
      await fs.promises.writeFile(filePath, Buffer.from(data.pdf, "base64"));
      return {
        filePath,
        filename: safeName,
        pages: data.pages,
        fileSize: data.size_bytes,
        creditsUsed: data.credits_used,
        creditsRemaining: data.credits_remaining,
      };
    },
  },
};
