import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_commerce",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The finance organization ID of the store",
      async options() {
        const { get_sites: { my_sites: sites } } = await this.listStores();
        if (!sites) {
          return [];
        }
        return sites.map(({
          zohofinance_orgid: value, site_title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://commerce.${this.$auth.base_api_url}/store/api/v1`;
    },
    _headers(orgId) {
      const headers = {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
      };
      if (orgId) {
        headers["X-com-zoho-store-organizationid"] = orgId;
      }
      return headers;
    },
    _makeRequest({
      $ = this,
      path,
      url,
      orgId,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(orgId),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/settings/webhooks",
        method: "POST",
        ...args,
      });
    },
    listStores(args = {}) {
      return this._makeRequest({
        url: `https://commerce.${this.$auth.base_api_url}/zs-site/api/v1/index/sites`,
        ...args,
      });
    },
    createProduct(args = {}) {
      return this._makeRequest({
        path: "/products",
        method: "POST",
        ...args,
      });
    },
  },
};
