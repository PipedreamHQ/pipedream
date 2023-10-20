import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stormboard",
  propDefinitions: {
    stormId: {
      type: "string",
      label: "Storm Id",
      description: "The storm to perform your action",
      async options({ page }) {
        const data = await this.listStorms(page + 1);
        return data.storms.map((item) => ({
          label: item.title,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.stormboard.com";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "X-API-Key": this._getApiKey(),
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async listStorms(page, ctx = this) {
      return this._makeHttpRequest({
        path: "/storms/list",
        method: "GET",
        params: {
          page,
        },
      }, ctx);
    },
    async createIdea(data, ctx = this) {
      const opts = {
        path: "/ideas",
        method: "POST",
        data,
      };
      return this._makeHttpRequest(opts, ctx);
    },
    async createStorm(data, ctx = this) {
      const opts = {
        path: "/storms",
        method: "POST",
        data,
      };
      return this._makeHttpRequest(opts, ctx);
    },
  },
};
