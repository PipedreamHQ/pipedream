import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cutt_ly",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The user's ID for tracking purposes",
      required: true,
    },
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL you want to shorten",
      required: true,
    },
    newSourceUrl: {
      type: "string",
      label: "New Source URL",
      description: "The new source URL to change a previously shortened URL",
      required: true,
    },
    shortenedUrl: {
      type: "string",
      label: "Shortened URL",
      description: "The shortened URL for which you want statistics",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://cutt.ly";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async shortenUrl({ targetUrl }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/shorten",
        data: {
          targetUrl,
        },
      });
    },
    async changeSourceUrl({
      shortenedUrl, newSourceUrl,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/api/shorten/${shortenedUrl}`,
        data: {
          newSourceUrl,
        },
      });
    },
    async getStatistics({ shortenedUrl }) {
      return this._makeRequest({
        path: `/api/statistics/${shortenedUrl}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
