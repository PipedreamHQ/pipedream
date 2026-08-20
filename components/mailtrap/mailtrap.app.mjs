import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailtrap",
  propDefinitions: {
    domainId: {
      type: "string",
      label: "Domain",
      description: "A sending domain verified in your Mailtrap account.",
      async options() {
        const { data: domains } = await this.listDomains({});
        return domains.map(({
          id, domain_name: domainName,
        }) => ({
          label: domainName,
          value: id,
        }));
      },
    },
    suppressionId: {
      type: "string",
      label: "Suppression",
      description: "A suppressed email address to remove from the suppression list.",
      async options() {
        const suppressions = await this.listSuppressions({});
        return suppressions.map(({
          id, email,
        }) => ({
          label: email,
          value: id,
        }));
      },
    },
  },
  methods: {
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token || this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _httpRequest({
      $ = this,
      baseURL = "https://send.api.mailtrap.io",
      endpoint,
      ...customConfig
    }) {
      return axios($, {
        url: `${baseURL}${endpoint}`,
        headers: this._getHeaders(),
        ...customConfig,
      });
    },
    async sendEmail(args = {}) {
      const {
        $, data,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://send.api.mailtrap.io",
        endpoint: "/api/send",
        method: "POST",
        data,
      });
    },
    async getEmailState(args = {}) {
      const {
        $, sendingMessageId,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: `/api/email_logs/${sendingMessageId}`,
        method: "GET",
      });
    },
    async listDomains(args = {}) {
      const { $ } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: "/api/domains",
        method: "GET",
      });
    },
    async listSuppressions(args = {}) {
      const {
        $, params,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: "/api/suppressions",
        method: "GET",
        params,
      });
    },
    async createSuppression(args = {}) {
      const {
        $, data,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: "/api/suppressions",
        method: "POST",
        data,
      });
    },
    async deleteSuppression(args = {}) {
      const {
        $, suppressionId,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: `/api/suppressions/${suppressionId}`,
        method: "DELETE",
      });
    },
  },
};
