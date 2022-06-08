import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rocketreach",
  propDefinitions: {
    name: {
      type: "string",
      description: "Name of the person you are looking for",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      description: "LinkedIn URL",
      optional: true,
    },
  },
  methods: {
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
        method: "GET",
        path: "/lookupProfile",
        params,
      }));
    },
    async lookupCompany(params, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/lookupCompany",
        params,
      }));
    },
  },
};
