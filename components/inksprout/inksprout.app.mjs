import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "inksprout",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://inksprout.co/api/v1";
    },
    _getHeaders() {
      console.log(this.$auth);
      return {
        "content-type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async summarize(ctx = this, params) {
      const result = await axios(ctx, this._getRequestParams({
        method: "POST",
        path: "/summarize",
        data: params,
      }));
      return result;
    },
  },
};
