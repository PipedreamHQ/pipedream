import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "siteleaf",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site Id",
      description: "The site to perform your action",
      async options({ page }) {
        const data = await this.listSites(page + 1);
        return data.map((item) => ({
          label: item.title,
          value: item.id,
        }));
      },
    },
    collectionPath: {
      type: "string",
      label: "Collection Path",
      description: "The collection to perform your action.",
      async options({
        siteId,
        page,
      }) {
        const data = await this.listCollections(siteId, page + 1);
        return data.map((item) => ({
          label: item.title,
          value: item.path,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.siteleaf.com/v2";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getApiSecret() {
      return this.$auth.api_secret;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        auth: {
          username: this._getApiKey(),
          password: this._getApiSecret(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async listSites(page, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/sites",
        params: {
          page,
        },
      }, ctx);
    },
    async listCollections(siteId, page, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/sites/${siteId}/collections`,
        params: {
          page,
        },
      }, ctx);
    },
    async listPages(siteId, page, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/sites/${siteId}/pages`,
        params: {
          page,
        },
      }, ctx);
    },
    async listDocuments(siteId, collectionPath, page, ctx = this) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/sites/${siteId}/collections/${collectionPath}/documents`,
        params: {
          page,
        },
      }, ctx);
    },
    async createDocument(siteId, collectionPath, data, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/sites/${siteId}/collections/${collectionPath}/documents`,
        data,
      }, ctx);
    },
  },
};
