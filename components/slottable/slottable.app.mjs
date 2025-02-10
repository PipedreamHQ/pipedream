import { axios } from "@pipedream/platform";

// Please remove this comment after testing DJ-2872
export default {
  type: "app",
  app: "slottable",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://slottable.app/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async getCompanyId() {
      const { data: { attributes: { company_id } } } = await this._makeRequest({
        path: "/token",
      });
      return company_id;
    },
    createWebhook({
      companyId, ...args
    }) {
      return this._makeRequest({
        path: `/companies/${companyId}/webhooks`,
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      companyId, hookId, ...args
    }) {
      return this._makeRequest({
        path: `/companies/${companyId}/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
