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
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        auth: {
          username: this._getApiKey(),
          password: this._getApiSecret(),
        },
      };
      return res;
    },
    async listSites(page, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/sites",
        params: {
          page,
        },
      }));
    },
    async listCollections(siteId, page, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `/sites/${siteId}/collections`,
        params: {
          page,
        },
      }));
    },
    async listPages(siteId, page, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `/sites/${siteId}/pages`,
        params: {
          page,
        },
      }));
    },
    async listDocuments(siteId, collectionPath, page, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `/sites/${siteId}/collections/${collectionPath}/documents`,
        params: {
          page,
        },
      }));
    },
    async createDocument(siteId, collectionPath, data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: `/sites/${siteId}/collections/${collectionPath}/documents`,
        data,
      }));
    },
  },
};
