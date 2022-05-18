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
    _getCompanyBaseUrl(version) {
      return `https://company.clearbit.com/${version}`;
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.secret_api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      const res = {
        ...opts,
        headers: this._getHeaders(),
      };
      return res;
    },
    companyNameToDomain(ctx = this, companyName) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getCompanyBaseUrl("v1")}/domains/find`,
        params: {
          name: companyName,
        },
      }));
    },
    domainLookup(ctx = this, params) {
      return axios(ctx, this._getRequestParams({
        method: "GET",
        url: `${this._getCompanyBaseUrl("v2")}/companies/find`,
        params,
      }));
    },
  },
};
