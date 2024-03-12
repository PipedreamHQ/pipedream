import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hyperise",
  propDefinitions: {
    originalUrl: {
      type: "string",
      label: "Original URL",
      description: "The original URL to create a personalised short URL for",
    },
    personalisationTags: {
      type: "string[]",
      label: "Personalisation Tags",
      description: "The personalisation tags to use for creating the personalised short URL",
    },
    customShortUrl: {
      type: "string",
      label: "Custom Short URL",
      description: "An optional custom short URL to use",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hyperise.io/v1";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async getImageViews() {
      return this._makeRequest({
        path: "/image_views",
      });
    },
    async createPersonalisedShortUrl(originalUrl, personalisationTags, customShortUrl) {
      return this._makeRequest({
        method: "POST",
        path: "/short_links",
        data: {
          original_url: originalUrl,
          personalisation_tags: personalisationTags,
          custom_short_url: customShortUrl,
        },
      });
    },
    async emitImageViewEvent() {
      return this.$emit({
        event: "New Image Viewed",
      });
    },
  },
};
