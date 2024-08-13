import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "spamcheck_ai",
  propDefinitions: {
    reportId: {
      type: "string",
      label: "Report ID",
      description: "ID of the Report",
      async options() {
        const reportsIds = await this.getSpamReports();
        return reportsIds.map(({ id }) => ({
          value: id,
        }));
      },
    },
    ip: {
      type: "string",
      label: "IP",
      description: "IP to check for known spam activities",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email to check for known spam activities",
      optional: true,
    },
    desiredOutcome: {
      type: "boolean",
      label: "Desired Outcome",
      description: "Desired outcome of the report",
    },
    result: {
      type: "boolean",
      label: "Result",
      description: "Result of the report",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes of the report",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.spamcheck.ai/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Api-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async spamCheck(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/spam/check",
        ...args,
      });
    },
    async spamReport(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/spam_reports",
        ...args,
      });
    },
    async deleteReport({
      id, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/spam_reports/${id}`,
        ...args,
      });
    },
    async getSpamReports(args = {}) {
      return this._makeRequest({
        path: "/spam_reports",
        ...args,
      });
    },
  },
};
