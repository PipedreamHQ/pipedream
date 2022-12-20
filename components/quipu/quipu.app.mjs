import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "quipu",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://getquipu.com";
    },
    _getHeaders() {
      return {
        "accept": "application/vnd.quipu.v1+json",
        "content-type": "application/vnd.quipu.v1+json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async createContact(ctx = this, attributes) {
      try {
        const data = {
          data: {
            type: "contacts",
            attributes,
          },
        };
        const response = await axios(ctx, this._getRequestParams({
          method: "POST",
          path: "/contacts",
          data,
        }));
        return response.data;
      } catch (ex) {
        console.log(ex?.response?.data?.errors);
        throw ex;
      }
    },
  },
};
