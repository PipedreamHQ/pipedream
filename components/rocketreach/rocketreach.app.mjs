import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rocketreach",
  propDefinitions: {
    name: {
      label: "Name",
      type: "string",
      description: "Name of the person you are looking for",
      optional: true,
    },
    linkedinUrl: {
      label: "LinkedIn URL",
      type: "string",
      description: "LinkedIn URL",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.rocketreach.co/v2/api";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Api-Key": `${this._apiKey()}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const response = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return response;
    },
    async lookupProfile(params, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        path: "/lookupProfile",
        params,
      }));
    },
    async lookupCompany(params, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        path: "/lookupCompany",
        params,
      }));
    },
  },
};
