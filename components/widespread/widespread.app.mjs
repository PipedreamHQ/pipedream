import { axios } from "@pipedream/platform";

const BASE = "https://widespread-bridge.widespread.workers.dev";

export default {
  type: "app",
  app: "widespread",
  methods: {
    async _request(path, params = {}) {
      return axios(this, {
        url: `${BASE}${path}`,
        params,
      });
    },
    async listMarkets($) {
      return this._request("/api/markets");
    },
    async searchFeed(params) {
      return this._request("/api/feed", params);
    },
    async listRunners() {
      return this._request("/api/runners");
    },
  },
};
