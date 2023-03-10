import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "refersion",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.refersion.com/v2";
    },
    _getPublicKey() {
      return this.$auth.public_key;
    },
    _getSecretKey() {
      return this.$auth.secret_key;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Refersion-Public-Key": this._getPublicKey(),
        "Refersion-Secret-Key": this._getSecretKey(),
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
    async createAffiliate(data, ctx = this) {
      return this._makeHttpRequest({
        path: "/affiliate/new",
        method: "POST",
        data,
      }, ctx);
    },
    authKeys() {
      console.log((this.$auth));
    },
  },
};
