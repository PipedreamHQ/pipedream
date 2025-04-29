import { axios } from "@pipedream/platform";
import methods from "./common/methods.mjs";

export default {
  type: "app",
  app: "google_search_console",
  propDefinitions: {
    siteUrl: {
      type: "string",
      label: "Site",
      description: "Select a verified site from your Search Console",
      async options({ prevContext }) {
        const { nextPageToken } = prevContext || {};
        return this.listSiteOptions(nextPageToken);
      },
    },
  },
  methods: {
    ...methods,
    _makeRequest({
      $ = this,
      url,
      ...opts
    }) {
      return axios($, {
        url,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    async getSites(params = {}) {
      return this._makeRequest({
        method: "GET",
        url: "https://searchconsole.googleapis.com/webmasters/v3/sites",
        ...params,
      });
    },
    async listSiteOptions(pageToken) {
      const params = {};
      if (pageToken) {
        params.pageToken = pageToken;
      }

      const {
        siteEntry = [], nextPageToken,
      } = await this.getSites({
        params,
      });

      return {
        options: siteEntry.map((site) => ({
          label: site.siteUrl,
          value: site.siteUrl,
        })),
        context: {
          nextPageToken,
        },
      };
    },
    getSitePerformanceData({
      url, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(url)}/searchAnalytics/query`,
        ...opts,
      });
    },
    submitUrlForIndexing(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        ...opts,
      });
    },
  },
};
