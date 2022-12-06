import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "triggercmd",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _getBaseUrl() {
      return "https://www.triggercmd.com";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this._accessToken()}`,
        "Content-Type": "application/json",
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async trigger(computer, trigger, params, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/oauth/pipedream",
        data: {
          computer: computer,
          trigger: trigger,
          params: params,
        },
      }));
      return res?.message || "Something went wrong.";
    },
  },
};
