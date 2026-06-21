import { axios } from "@pipedream/platform";

// Attestify needs no credentials (free, no signup), so this app declares no auth.
// It exists as the branded namespace + shared HTTP method/prop definitions for the actions.
export default {
  type: "app",
  app: "attestify",
  propDefinitions: {
    issuer: {
      type: "string",
      label: "Organization / Issuer",
      description:
        "The organization issuing the certificate (shown on the certificate and the public verify page). Example: `Acme Real Estate Academy`.",
    },
    course: {
      type: "string",
      label: "Course / Credential",
      description:
        "The course or credential being certified. Example: `4-Hour Continuing Education — Ethics`.",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "Name of the certificate recipient.",
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description:
        "Optional. Echoed back so you can join it to the verify URL for your mail-merge or LMS. It is **never** stored in the signed record and **never** shown on the public verify page — recipient PII stays on your side.",
      optional: true,
    },
    completionDate: {
      type: "string",
      label: "Completion Date",
      description:
        "Optional. The date the credential was earned, shown on the certificate (format `YYYY-MM-DD`, for example `2026-06-21`). Leave empty to stamp today.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://attestify.novadyne.ai";
    },
    async _request($, { path, headers, ...opts } = {}) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          // identify Pipedream-sourced issuances in telemetry (= the demand signal)
          "User-Agent": "pipedream-attestify/0.0.1",
        },
      });
    },
    async issueCertificate($, data) {
      return this._request($, {
        method: "POST",
        path: "/cert/issue",
        data,
      });
    },
  },
};
