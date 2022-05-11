import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "imgbb",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.imgbb.com/1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          key: this.$auth.api_key,
        },
      };
      return res;
    },
    uploadPicture(ctx = this, data) {
      return axios(ctx, this._getAxiosParams({
        method: "post",
        path: "/upload",
        data,
      }));
    },
  },
};
