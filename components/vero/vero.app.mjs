import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vero",
  propDefinitions: {},
  methods: {
    _getAuthToken() {
      return this.$auth.auth_token;
    },
    _getBaseUrl() {
      return "https://api.getvero.com/api/v2";
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        params: {
          ...opts.params,
          auth_token: this._getAuthToken(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async createOrUpdateUser(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/users/track",
        data,
      });
    },
  },
};
