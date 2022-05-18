import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clearbit",
  propDefinitions: {
    companyName: {
      label: "Company Name",
      type: "string",
      description: "The name of the company.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://company.clearbit.com/v1";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.secret_api_key}`,
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
    companyNameToDomain(ctx = this, companyName) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: `/domains/find?name=${companyName}`,
      }));
    },
  },
};
