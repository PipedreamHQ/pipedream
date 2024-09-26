import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "l2s",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to be shortened",
    },
    customKey: {
      type: "string",
      label: "Custom Key",
      description: "Custom key for the shortened URL",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "UTM source parameter",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "UTM medium parameter",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "UTM campaign parameter",
      optional: true,
    },
    utmTerm: {
      type: "string",
      label: "UTM Term",
      description: "UTM term parameter",
      optional: true,
    },
    utmContent: {
      type: "string",
      label: "UTM Content",
      description: "UTM content parameter",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for the shortened URL",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the URL",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.l2s.is";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path = "/url", headers, data,
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        data,
      });
    },
    async shortenUrl(opts = {}) {
      const {
        url, customKey, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, title, tags,
      } = opts;
      const data = {
        url,
        customKey,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        title,
        tags,
      };
      return this._makeRequest({
        data,
      });
    },
  },
};
