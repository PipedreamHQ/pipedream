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
  },
  methods: {
    _baseUrl() {
      return "https://api.cufinder.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path = "/",
        ...args
      } = opts;
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        data: {
          ...args.data,
          "apiKey": this.$auth.api_key,
        },
      });
    },
    async findCompanyWebsite(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cuf",
        ...args,
      });
    },
    async findCompanyEmail(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dte",
        ...args,

      });
    },
    async findCompanyPhone(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dtpp",
        ...args,
      });
    },
  },
};
