import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "verifly",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address to verify, for example `lead@example.com`.",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The list of email addresses to verify in a single bulk job.",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "An optional name to label the bulk job, for example `leads-2024.csv`.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Optional public HTTPS URL that Verifly calls when the bulk job completes.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://verifly.email/api/v1";
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    verifyEmail({
      email, ...args
    } = {}) {
      return this._makeRequest({
        path: "/verify",
        params: {
          email,
        },
        ...args,
      });
    },
    createBulkJob(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify/bulk",
        ...args,
      });
    },
    getJob({
      jobId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    getCredits(args = {}) {
      return this._makeRequest({
        path: "/credits",
        ...args,
      });
    },
  },
};
