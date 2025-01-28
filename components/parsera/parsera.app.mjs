import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "parsera",
  propDefinitions: {
    proxyCountry: {
      type: "string",
      label: "Proxy Country",
      description: "Set a specific proxy country for the request.",
      optional: true,
      async options() {
        const response = await this.listProxyCountries();
        return Object.entries(response)
          .map(([
            value,
            label,
          ]) => ({
            label,
            value,
          }));
      },
    },
    attributes: {
      type: "string[]",
      label: "Attributes",
      description: "List of attributes to extract or parse from the content. Format each attribute as a JSON string. Eg. `{\"name\": \"Title\",\"description\": \"News title\"}`.",
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.parsera.org/v1${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        ...headers,
        "X-API-KEY": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listProxyCountries(args = {}) {
      return this._makeRequest({
        path: "/proxy-countries",
        ...args,
      });
    },
  },
};
