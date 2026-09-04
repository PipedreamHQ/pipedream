import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anyapi",
  propDefinitions: {
    sku: {
      type: "string",
      label: "API",
      description: "The API to call, identified by its slug (for example `reddit.search`). Type to search the catalog, or run the **Search APIs** action first and paste a slug from its results.",
      async options({ query }) {
        const apis = query
          ? (await this.searchCatalog({
            params: {
              q: query,
            },
          })).results
          : (await this.listApis()).apis;
        return (apis ?? []).map(({
          slug, name,
        }) => ({
          label: `${name} (${slug})`,
          value: slug,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getanyapi.com";
    },
    _headers() {
      return {
        "X-API-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    searchCatalog(opts = {}) {
      return this._makeRequest({
        path: "/catalog/search",
        ...opts,
      });
    },
    listApis(opts = {}) {
      return this._makeRequest({
        path: "/v1/apis",
        ...opts,
      });
    },
    getApi({
      sku, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/apis/${encodeURIComponent(sku)}`,
        ...opts,
      });
    },
    runApi({
      sku, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/run/${encodeURIComponent(sku)}`,
        ...opts,
      });
    },
    getBalance(opts = {}) {
      return this._makeRequest({
        path: "/v1/balance",
        ...opts,
      });
    },
  },
};
