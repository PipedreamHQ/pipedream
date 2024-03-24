import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "builtwith",
  version: "0.0.{{ts}}",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your BuiltWith API Key",
      secret: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the website to look up",
    },
    socialUrl: {
      type: "string",
      label: "Social Media URL",
      description: "The social media URL associated with a website",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.builtwith.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        params,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.apiKey}`,
        },
        ...otherOpts,
      });
    },
    async getTechnologyInformation({ domain }) {
      return this._makeRequest({
        path: "/domain-api.json",
        params: {
          key: this.apiKey,
          lookup: domain,
        },
      });
    },
    async getLinksBetweenWebsites({ domain }) {
      return this._makeRequest({
        path: "/relationships-api.json",
        params: {
          key: this.apiKey,
          lookup: domain,
        },
      });
    },
    async getWebsitesAssociatedWithSocialMedia({ socialUrl }) {
      return this._makeRequest({
        path: "/social-api.json",
        params: {
          key: this.apiKey,
          q: socialUrl,
        },
      });
    },
  },
};
