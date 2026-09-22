import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gosquared",
  propDefinitions: {
    siteToken: {
      type: "string",
      label: "Site Token",
      description: "The token for the project you are retrieving data for",
      async options() {
        const { owned } = await this.getSites();
        return owned.map((site) => ({
          label: `${site.name} (${site.domain})`,
          value: site.site_token,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gosquared.com";
    },
    _getAuthParams(params) {
      return {
        ...params,
        api_key: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._getAuthParams(params),
        ...args,
      });
    },
    getSites(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/account/v1/sites",
        ...opts,
      });
    },
    identify(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tracking/v1/identify",
        ...opts,
      });
    },
    trackEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tracking/v1/event",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/account/v1/webhooks",
        ...opts,
      });
    },
    deleteHook({
      webhookId,
      ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/account/v1/webhooks/${webhookId}`,
        ...opts,
      });
    },
  },
};
