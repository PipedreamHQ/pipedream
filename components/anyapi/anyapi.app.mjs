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
    /**
     * @returns {string} the AnyAPI gateway base URL
     */
    _baseUrl() {
      return "https://api.getanyapi.com";
    },
    /**
     * Builds the request headers. The catalog search endpoint answers without a
     * credential, so the key is sent only when an AnyAPI account is connected.
     *
     * @returns {object} the headers for a gateway request
     */
    _headers() {
      const apiKey = this.$auth?.api_key;
      return apiKey
        ? {
          "X-API-Key": apiKey,
        }
        : {};
    },
    /**
     * @param {object} opts - axios options, plus the gateway `path` to call
     * @returns {Promise<object>} the parsed gateway response
     */
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * Searches the catalog. Accepts any one of `q`, `category` or `platform`.
     *
     * @param {object} [opts] - axios options, including `params`
     * @returns {Promise<object>} the ranked matches and their USD pricing
     */
    searchCatalog(opts = {}) {
      return this._makeRequest({
        path: "/catalog/search",
        ...opts,
      });
    },
    /**
     * @param {object} [opts] - axios options
     * @returns {Promise<object>} every API in the catalog
     */
    listApis(opts = {}) {
      return this._makeRequest({
        path: "/v1/apis",
        ...opts,
      });
    },
    /**
     * @param {object} opts - axios options, plus the API `sku` slug
     * @returns {Promise<object>} the API definition, with its `inputSchema`
     */
    getApi({
      sku, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/apis/${encodeURIComponent(sku)}`,
        ...opts,
      });
    },
    /**
     * @param {object} opts - axios options, plus the API `sku` slug and `data`
     * @returns {Promise<object>} the normalized output and the USD charged
     */
    runApi({
      sku, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/run/${encodeURIComponent(sku)}`,
        ...opts,
      });
    },
    /**
     * @param {object} [opts] - axios options
     * @returns {Promise<object>} the wallet's remaining USD balance
     */
    getBalance(opts = {}) {
      return this._makeRequest({
        path: "/v1/balance",
        ...opts,
      });
    },
  },
};
