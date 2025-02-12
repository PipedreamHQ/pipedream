import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tinyurl",
  propDefinitions: {
    urls: {
      type: "string",
      label: "Alias",
      description: "The existing alias for this TinyURL",
      async options({ domain }) {
        const { data } = await this.listURLs({
          type: "available",
        });

        return data
          .filter((alias) => alias.domain === domain)
          .map(({
            alias: value, tiny_url: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    url: {
      type: "string",
      label: "URL",
      description: "The long URL that will be shortened",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain you would like the TinyURL to use. Select from TinyURL free domain tinyurl.com or subscribe and use TinyURL branded domains.",
      default: "tinyurl.com",
    },
    alias: {
      type: "string",
      label: "Custom Alias",
      description: "A short string of characters to use in the TinyURL. If ommitted, one will be randomly generated. When using a branded domain, this has a minimum length of 1 character.",
      optional: true,
    },
    expiresAt: {
      type: "string",
      label: "Expires At",
      description: "TinyURL expiration in ISO8601 format. If not set so TinyURL never expires. **Example: 2024-10-25 10:11:12**. **Paid accounts only**",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags group and categorize TinyURLs together. **Paid accounts only**",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tinyurl.com";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      };
      console.log("config: ", config);
      return axios($, config);
    },
    createTinyURL(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create",
        ...opts,
      });
    },
    updateTinyURLMetadata(opts = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: "/update",
        ...opts,
      });
    },
    listURLs({
      type, ...opts
    }) {
      return this._makeRequest({
        path: `/urls/${type}`,
        opts,
      });
    },
  },
};
