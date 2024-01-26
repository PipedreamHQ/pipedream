import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cufinder",
  propDefinitions: {
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company to find the website for",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the company to find the email and phone for",
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API key for authenticating requests",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cufinder.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "apiKey": this.apiKey,
        },
      });
    },
    async findCompanyWebsite({ companyName }) {
      return this._makeRequest({
        method: "POST",
        path: "/company-website",
        data: {
          companyName,
        },
      });
    },
    async findCompanyEmail({ domain }) {
      return this._makeRequest({
        method: "POST",
        path: "/company-email",
        data: {
          domain,
        },
      });
    },
    async findCompanyPhone({ domain }) {
      return this._makeRequest({
        method: "POST",
        path: "/company-phone",
        data: {
          domain,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
