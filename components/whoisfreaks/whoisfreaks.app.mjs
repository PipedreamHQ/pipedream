import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whoisfreaks",
  propDefinitions: {
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The domain name to lookup",
    },
    format: {
      type: "string",
      label: "Format",
      description: "Two formats are available JSON, XML. If you don't specify the 'format' parameter, the default format will be JSON.",
      options: [
        "JSON",
        "XML",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.whoisfreaks.com/v1.0";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          apiKey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    domainLookup(opts = {}) {
      return this._makeRequest({
        path: "/whois",
        ...opts,
      });
    },
    ipLookup(opts = {}) {
      return this._makeRequest({
        path: "/ip-whois",
        ...opts,
      });
    },
  },
};
