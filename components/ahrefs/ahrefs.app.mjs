import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ahrefs",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results to return",
      default: 1000,
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Select a mode of operation (defaults to `domain`)",
      options: [
        {
          label: "Exact",
          value: "exact",
        },
        {
          label: "Domain",
          value: "domain",
        },
        {
          label: "Subdomain",
          value: "subdomains",
        },
        {
          label: "Prefix",
          value: "prefix",
        },
      ],
      default: "domain",
      optional: true,
    },
    target: {
      type: "string",
      label: "Target",
      description: "Enter a domain or URL",
    },
    select: {
      type: "string[]",
      label: "Select",
      description: "An array of columns to return. [See response schema](https://docs.ahrefs.com/docs/api/site-explorer/operations/list-all-backlinks) for valid column identifiers.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ahrefs.com/v3";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getBacklinks(opts = {}) {
      return this._makeRequest({
        path: "/site-explorer/all-backlinks",
        ...opts,
      });
    },
    getReferringDomains(opts = {}) {
      return this._makeRequest({
        path: "/site-explorer/refdomains",
        ...opts,
      });
    },
  },
};
