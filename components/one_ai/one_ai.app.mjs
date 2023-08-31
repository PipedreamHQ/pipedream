import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "one_ai",
  propDefinitions: {
    collection: {
      type: "string",
      label: "Collection",
      description: "Collection to use for clustering.",
      async options() {
        const res = await this.listCollections();
        return res.collections;
      },
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.oneai.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "api-key": this._getApiKey(),
      };
    },
    _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    listCollections() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/clustering/v1/collections",
      });
    },
    findTextInClusters(clusterName, query) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/clustering/v1/collections/${clusterName}/clusters/find`,
        query,
      });
    },
    summarizeText(text) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/api/v0/pipeline",
        data: {
          input: text,
          steps: [
            {
              skill: "summarize",
            },
          ],
        },
      });
    },
  },
};
