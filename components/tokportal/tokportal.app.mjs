import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "tokportal",
  propDefinitions: {
    bundleId: {
      type: "string",
      label: "Bundle ID",
      description: "The UUID of the bundle (mission). Use **List Bundles** to find bundle IDs.",
      async options({ page }) {
        const response = await this.listBundles({
          params: {
            page: page + 1,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        const bundles = response?.data ?? [];
        return bundles.map((bundle) => ({
          label: `${bundle.title || bundle.bundle_type || "Bundle"} (${bundle.status}) - ${bundle.id}`,
          value: bundle.id,
        }));
      },
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The UUID of a delivered (saved) account. Use **List Accounts** to find account IDs.",
      async options({ page }) {
        const response = await this.listAccounts({
          params: {
            page: page + 1,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        const accounts = response?.data ?? [];
        return accounts.map((account) => ({
          label: `@${account.username} (${account.platform}) - ${account.id}`,
          value: account.id,
        }));
      },
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Social platform of the account. New bundles accept `tiktok` or `instagram`.",
      options: constants.PLATFORM_OPTIONS,
    },
    country: {
      type: "string",
      label: "Country",
      description: "ISO country code of the account manager who will create the account (for example `US`). Available countries come from `GET /countries`.",
      async options() {
        const response = await this.listCountries();
        const countries = response?.data ?? [];
        return countries.map((country) => ({
          label: `${country.name} (${country.code})`,
          value: country.code,
        }));
      },
    },
    bundleType: {
      type: "string",
      label: "Bundle Type",
      description: "`account_and_videos` (new account + video slots), `account_only` (new account) or `videos_only` (video slots on an existing delivered account).",
      options: constants.BUNDLE_TYPE_OPTIONS,
    },
    bundleStatus: {
      type: "string",
      label: "Status",
      description: "Bundle status, e.g. `draft`, `pending_setup`, `published`, `accepted`, `completed`, `cancelled`.",
      options: constants.BUNDLE_STATUS_OPTIONS,
    },
    externalRef: {
      type: "string",
      label: "External Reference",
      description: "Your own correlation reference (for example a CRM or spreadsheet row ID).",
    },
    position: {
      type: "integer",
      label: "Video Position",
      description: "1-based position of the video slot inside the bundle.",
      min: 1,
    },
    webhookEvents: {
      type: "string[]",
      label: "Events",
      description: "TokPortal event types to subscribe to, e.g. `account.finalized`, `video.finalized`, `account.banned`. See [the webhook events catalog](https://developers.tokportal.com/webhooks/).",
      async options() {
        try {
          const response = await this.listWebhookEvents();
          const events = response?.data?.events ?? [];
          if (events.length) {
            return events.map((event) => ({
              label: `${event.type} - ${event.description}`,
              value: event.type,
            }));
          }
        } catch {
          // fall back to the static list below
        }
        return constants.WEBHOOK_EVENTS;
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of items to return. Leave empty to return all pages.",
      min: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return constants.BASE_URL;
    },
    _headers(headers = {}) {
      return {
        "X-API-Key": this.$auth.api_key,
        "X-TokPortal-Client": constants.CLIENT_HEADER,
        "Accept": "application/json",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        ...args,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        paramsSerializer: utils.serializeParams,
      });
    },
    getCurrentUser(args = {}) {
      return this._makeRequest({
        path: "/me",
        ...args,
      });
    },
    listCountries(args = {}) {
      return this._makeRequest({
        path: "/countries",
        ...args,
      });
    },
    listBundles(args = {}) {
      return this._makeRequest({
        path: "/bundles",
        ...args,
      });
    },
    getBundle({
      bundleId, ...args
    }) {
      return this._makeRequest({
        path: `/bundles/${bundleId}`,
        ...args,
      });
    },
    createBundle(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/bundles",
        ...args,
      });
    },
    publishBundle({
      bundleId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bundles/${bundleId}/publish`,
        ...args,
      });
    },
    getPublishReadiness({
      bundleId, ...args
    }) {
      return this._makeRequest({
        path: `/bundles/${bundleId}/publish-readiness`,
        ...args,
      });
    },
    configureVideo({
      bundleId, position, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/bundles/${bundleId}/videos/${position}`,
        ...args,
      });
    },
    publishAllBundleVideos({
      bundleId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bundles/${bundleId}/videos/publish-all`,
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    getAccount({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}`,
        ...args,
      });
    },
    listAccountBans(args = {}) {
      return this._makeRequest({
        path: "/account-bans",
        ...args,
      });
    },
    getCreditBalance(args = {}) {
      return this._makeRequest({
        path: "/credits/balance",
        ...args,
      });
    },
    getCreditCosts(args = {}) {
      return this._makeRequest({
        path: "/credit-costs",
        ...args,
      });
    },
    uploadImageFromUrl(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/upload/image/from-url",
        ...args,
      });
    },
    getAnalyticsDashboard(args = {}) {
      return this._makeRequest({
        path: "/analytics",
        ...args,
      });
    },
    listWebhookEvents(args = {}) {
      return this._makeRequest({
        path: "/webhooks/events",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    getWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    /**
     * Iterates over every item of a paginated TokPortal list endpoint
     * (`{ data: [...], pagination: { page, per_page, total, total_pages } }`).
     */
    async *paginate({
      fn, params = {}, maxResults, ...args
    }) {
      let page = 1;
      let count = 0;
      while (true) {
        const response = await fn({
          ...args,
          params: {
            ...params,
            page,
            per_page: constants.DEFAULT_LIMIT,
          },
        });
        const items = response?.data ?? [];
        for (const item of items) {
          yield item;
          count += 1;
          if (maxResults && count >= maxResults) {
            return;
          }
        }
        const pagination = response?.pagination;
        if (!items.length || !pagination || pagination.page >= pagination.total_pages) {
          return;
        }
        page += 1;
      }
    },
  },
};
