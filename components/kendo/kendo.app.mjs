import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  type: "app",
  app: "kendo",
  description: "Pipedream Kendo AI Components",
  propDefinitions: {
    repName: {
      type: "string",
      label: "Rep Name",
      description: "Full name of the sales rep on the call.",
      optional: true,
    },
    repEmail: {
      type: "string",
      label: "Rep Email",
      description: "Email of the sales rep on the call.",
      optional: true,
    },
    callTitle: {
      type: "string",
      label: "Call Title",
      description:
        "Title for the call. If omitted, Kendo will auto-generate one using AI.",
      optional: true,
    },
    disableAiTitle: {
      type: "boolean",
      label: "Disable AI Title Generation",
      description:
        "Set to `true` to use your provided **Call Title** as-is, skipping Kendo's AI title generation.",
      optional: true,
      default: false,
    },
    callDate: {
      type: "string",
      label: "Call Date",
      description: "ISO 8601 date of the call (e.g. `2026-04-27T10:00:00Z`).",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description:
        "Call duration. Kendo accepts minutes, seconds, or milliseconds and normalizes automatically.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description:
        "Flat key/value object of custom metadata to attach to the call (e.g. `{ source: 'hubspot', recordId: '123' }`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.kendo.ai/api/integrations/push-api";
    },
    _apiKey() {
      return this.$auth.apiKey;
    },
    _webhookSecret() {
      return this.$auth.webhookSecret;
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this._apiKey(),
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    submitCall({
      $, data,
    }) {
      return this.post({
        $,
        path: "/ingest",
        data,
      });
    },
    verifyWebhookSignature(raw_body, signature) {
      const expected = crypto
        .createHmac("sha256", this._webhookSecret())
        .update(raw_body)
        .digest("hex");
      try {
        return crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expected),
        );
      } catch {
        return false;
      }
    },
  },
};
