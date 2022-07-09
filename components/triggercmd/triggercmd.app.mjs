import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "triggercmd",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://www.triggercmd.com";
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
      };
      return res;
    },
    async trigger(token, computer, trigger, params, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "POST",
        path: `/api/run/triggerSave`,
        data: {
          token: token,
          computer: computer,
          trigger: trigger,
          params: params
        },
      }));
      return res?.message || "Something went wrong.";
    },
  },
};
