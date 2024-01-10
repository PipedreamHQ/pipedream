import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "piloterr",
  propDefinitions: {
    url: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to retrieve core technology information from",
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The domain name of the company to fetch data for",
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to obtain HTML from",
    },
  },
  methods: {
    _baseUrl() {
      return "https://piloterr.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
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
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async getUsage(opts = {}) {
      return this._makeRequest({
        path: "/usage",
        ...opts,
      });
    },
    async getWebsiteTechnology(opts = {}) {
      return this._makeRequest({
        path: `/website/technology?website_url=${this.url}`,
        ...opts,
      });
    },
    async getCompanyData(opts = {}) {
      return this._makeRequest({
        path: `/company?domain_name=${this.domainName}`,
        ...opts,
      });
    },
    async scrapeWebsite(opts = {}) {
      return this._makeRequest({
        path: `/website/crawler?website_url=${this.websiteUrl}`,
        ...opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
