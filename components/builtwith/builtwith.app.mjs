import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "builtwith",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the website to look up",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.builtwith.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          KEY: `${this.$auth.api_key}`,
        },
      });
    },
    async getWebsiteTechnologies(args = {}) {
      return this._makeRequest({
        path: "/v21/api.json",
        ...args,
      });
    },
    async getWebsiteRelationships(args = {}) {
      return this._makeRequest({
        path: "/rv2/api.json",
        ...args,
      });
    },
    async getSocialMediaWebsites(args = {}) {
      return this._makeRequest({
        path: "/social1/api.json",
        ...args,
      });
    },
  },
};
