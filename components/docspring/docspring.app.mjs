import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docspring",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template",
      description: "The DocSpring template.",
      async options({ page }) {
        const templates = await this.listTemplates({
          params: {
            per_page: 50,
            page: (page ?? 0) + 1,
          },
        });
        return (Array.isArray(templates) ? templates : []).map((t) => ({
          label: t.name || t.id,
          value: t.id,
        }));
      },
    },
    data: {
      type: "object",
      label: "Data",
      description: "The field data to merge into the template, e.g. `{ \"first_name\": \"Jane\" }`.",
      optional: true,
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Generate a free, watermarked test PDF.",
      optional: true,
    },
    submissionId: {
      type: "string",
      label: "Submission ID",
      description: "A submission ID (`sub_...`).",
    },
    dataRequestId: {
      type: "string",
      label: "Data Request ID",
      description: "A data request ID (`drq_...`).",
    },
    eventTypes: {
      type: "string[]",
      label: "Events",
      description: "The DocSpring events to subscribe to.",
      options: [
        "submission.processed",
        "submission.failed",
        "submission.created",
        "submission.expired",
        "submission_data_request.completed",
        "submission_data_request.viewed",
        "combined_submission.processed",
        "combined_submission.failed",
        "submission_batch.processed",
        "submission_batch.failed",
        "template.created",
        "template.updated",
        "template.deleted",
      ],
    },
  },
  methods: {
    _region() {
      return (this.$auth.region || "us").toLowerCase();
    },
    _baseUrl(sync = false) {
      const region = this._region();
      if (region === "self_hosted") {
        const host = (this.$auth.custom_host || "").trim();
        if (!host) {
          throw new Error(
            "A Self-Hosted Host is required for the Self-Hosted / Enterprise region (e.g. https://docspring.example.com).",
          );
        }
        return host.includes("://") ? host : `https://${host}`;
      }
      const hosts = {
        us: { host: "api.docspring.com", sync: "sync.api.docspring.com" },
        eu: { host: "api-eu.docspring.com", sync: "sync.api-eu.docspring.com" },
      };
      const entry = hosts[region] || hosts.us;
      return `https://${sync ? entry.sync : entry.host}`;
    },
    _headers() {
      const token = Buffer.from(`${this.$auth.token_id}:${this.$auth.token_secret}`).toString("base64");
      return {
        Authorization: `Basic ${token}`,
        Accept: "application/json",
      };
    },
    _makeRequest({
      $ = this, path, sync = false, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl(sync)}/api/v1${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    generatePdf({ templateId, ...opts }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/submissions`,
        params: { wait: true },
        sync: true,
        ...opts,
      });
    },
    combinePdfs(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/combined_submissions",
        params: { wait: true },
        sync: true,
        ...opts,
      });
    },
    createSubmission({ templateId, ...opts }) {
      return this._makeRequest({
        method: "POST",
        path: `/templates/${templateId}/submissions`,
        ...opts,
      });
    },
    createToken({ dataRequestId, ...opts }) {
      return this._makeRequest({
        method: "POST",
        path: `/data_requests/${dataRequestId}/tokens`,
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    getSubmission({ submissionId, ...opts }) {
      return this._makeRequest({
        path: `/submissions/${submissionId}`,
        ...opts,
      });
    },
    listSubmissions(opts = {}) {
      return this._makeRequest({
        path: "/submissions",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({ uid, ...opts }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${uid}`,
        ...opts,
      });
    },
  },
};
