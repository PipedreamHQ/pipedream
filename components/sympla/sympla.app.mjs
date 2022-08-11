import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sympla",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.sympla.com.br/public";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "s_token": this.$auth.token,
      };
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listEvents(page, from, published) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: "/v3/events",
        params: {
          page,
          from,
          published,
        },
      }));
      return res;
    },
  },
};
