import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jo4",
  propDefinitions: {
    urlSlug: {
      type: "string",
      label: "URL",
      description: "Select a short URL",
      async options({ page }) {
        const { urls } = await this.listUrls({
          params: {
            page,
            size: 25,
          },
        });
        return urls?.map((url) => ({
          label: `${url.fullShortUrl || url.shortUrl} → ${url.longUrl}`,
          value: url.slug,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://jo4-api.jo4.io/api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      path, $ = this, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async createUrl(opts = {}) {
      const result = await this._makeRequest({
        method: "POST",
        path: "/protected/url",
        ...opts,
      });
      return result?.response ?? result;
    },
    async listUrls(opts = {}) {
      const result = await this._makeRequest({
        path: "/protected/url/myurls",
        ...opts,
      });
      return result?.response ?? result;
    },
    async getUrlStats({
      slug, ...opts
    }) {
      const result = await this._makeRequest({
        path: `/protected/url/${encodeURIComponent(slug)}/stats`,
        ...opts,
      });
      return result?.response ?? result;
    },
    async subscribeWebhook({
      event, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/zapier/hooks/${encodeURIComponent(event)}`,
        ...opts,
      });
    },
    async unsubscribeWebhook({
      subscriptionId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/zapier/hooks/${encodeURIComponent(subscriptionId)}`,
        ...opts,
      });
    },
    async getRecentUrls(opts = {}) {
      return this._makeRequest({
        path: "/zapier/urls/recent",
        ...opts,
      });
    },
    async getRecentReferrers(opts = {}) {
      return this._makeRequest({
        path: "/zapier/referrers/recent",
        ...opts,
      });
    },
  },
};
