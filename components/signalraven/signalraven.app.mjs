import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "signalraven",
  propDefinitions: {
    signalId: {
      type: "string",
      label: "Signal ID",
      description: "The signal to fetch. Pick from recent signals, or use the `id` from **List Signals**, for example `3f9c2a1e-...`.",
      async options({ page }) {
        const { data } = await this.listSignals({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return (data || []).map((signal) => ({
          value: signal.id,
          label: [
            signal.person?.name,
            signal.person?.title,
            signal.person?.company,
          ].filter(Boolean).join(" · ") || signal.id,
        }));
      },
    },
    reportId: {
      type: "string",
      label: "Report ID",
      description: "The research report to fetch. Use the `id` from **List Intelligence Reports**.",
      async options({
        page, reportType,
      }) {
        const { data } = await this.listIntelligence({
          params: {
            type: reportType,
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return (data || []).map((report) => ({
          value: report.id,
          label: `${report.name || report.slug || report.id} (${report.status})`,
        }));
      },
    },
    minStrength: {
      type: "integer",
      label: "Minimum Strength",
      description: "Only signals with a strength score at or above this value, from 0 to 10. Use 7 for warm, 9 for the strongest.",
      optional: true,
      min: 0,
      max: 10,
    },
    signalType: {
      type: "string",
      label: "Signal Type",
      description: "Filter by signal type, for example `KEYWORD_SEARCH_COMMENT` or `COMPANY_PAGE_REACTION`. Leave empty for all types.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return, up to 100.",
      optional: true,
      default: constants.DEFAULT_LIMIT,
      min: 1,
      max: constants.MAX_LIMIT,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip, for paging.",
      optional: true,
      default: 0,
      min: 0,
    },
  },
  methods: {
    _getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    _getUrl(path) {
      return `${this._getBaseUrl()}${path}`;
    },
    _isInvalidScope(error) {
      const text = `${error?.message || ""} ${JSON.stringify(error?.response?.data || "")}`;
      return /invalid_scope/i.test(text);
    },
    /**
     * SignalRaven API keys are OAuth clients. Exchange the client id and
     * secret for a short-lived bearer token with the client_credentials
     * grant. A key may have been created with a subset of scopes, so on
     * invalid_scope the caller retries with only the scope it needs.
     */
    async _getToken({
      $ = this, scopes,
    } = {}) {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.$auth.client_id,
        client_secret: this.$auth.client_secret,
        scope: scopes.join(" "),
      });
      const response = await axios($, {
        method: "POST",
        url: constants.TOKEN_URL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: body.toString(),
      });
      return response.access_token;
    },
    async _getTokenForScope({
      $, scope, extraScopes = [],
    }) {
      const wanted = [
        ...new Set([
          ...constants.READ_SCOPES,
          ...extraScopes,
        ]),
      ];
      try {
        return await this._getToken({
          $,
          scopes: wanted,
        });
      } catch (error) {
        if (!this._isInvalidScope(error)) {
          throw error;
        }
        return this._getToken({
          $,
          scopes: [
            scope,
          ],
        });
      }
    },
    async _makeRequest({
      $ = this, path, scope, extraScopes, headers, ...args
    } = {}) {
      const token = await this._getTokenForScope({
        $,
        scope,
        extraScopes,
      });
      return axios($, {
        url: this._getUrl(path),
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          ...headers,
        },
        ...args,
      });
    },
    listSignals(args = {}) {
      return this._makeRequest({
        path: "/signals",
        scope: "read:signals",
        ...args,
      });
    },
    getSignal({
      signalId, ...args
    }) {
      return this._makeRequest({
        path: `/signals/${signalId}`,
        scope: "read:signals",
        ...args,
      });
    },
    listSources(args = {}) {
      return this._makeRequest({
        path: "/sources",
        scope: "read:sources",
        ...args,
      });
    },
    listWatchlist(args = {}) {
      return this._makeRequest({
        path: "/watchlist",
        scope: "read:watchlist",
        ...args,
      });
    },
    getIcp(args = {}) {
      return this._makeRequest({
        path: "/icp",
        scope: "read:icp",
        ...args,
      });
    },
    listIntelligence(args = {}) {
      return this._makeRequest({
        path: "/intelligence",
        scope: "read:intelligence",
        ...args,
      });
    },
    getAccountIntelligence({
      reportId, ...args
    }) {
      return this._makeRequest({
        path: `/intelligence/accounts/${reportId}`,
        scope: "read:intelligence",
        ...args,
      });
    },
    getPersonIntelligence({
      reportId, ...args
    }) {
      return this._makeRequest({
        path: `/intelligence/people/${reportId}`,
        scope: "read:intelligence",
        ...args,
      });
    },
    runAccountIntelligence(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/intelligence/accounts",
        scope: "write:intelligence",
        extraScopes: [
          "write:intelligence",
        ],
        ...args,
      });
    },
    runPersonIntelligence(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/intelligence/people",
        scope: "write:intelligence",
        extraScopes: [
          "write:intelligence",
        ],
        ...args,
      });
    },
    getUsage(args = {}) {
      return this._makeRequest({
        path: "/usage",
        scope: "read:usage",
        ...args,
      });
    },
  },
};
