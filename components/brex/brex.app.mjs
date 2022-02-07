export default {
  type: "app",
  app: "brex",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://platform.brexapis.com/v2";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path + this._getQuery(opts.params),
        headers: this._getHeaders(),
      };
    },
  },
};
