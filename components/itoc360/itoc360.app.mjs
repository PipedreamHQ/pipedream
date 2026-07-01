import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "itoc360",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.itoc360.app";
    },
    /**
     * The per-source token used to authenticate inbound events. Configured as
     * part of the ITOC360 app connection (Sources -> Create Source).
     *
     * @returns {string} The source token from the connected account.
     */
    _sourceToken() {
      return this.$auth.source_token;
    },
    /**
     * Performs an authenticated request against the ITOC360 API. The base URL
     * and the source token are pinned here and cannot be overridden by callers,
     * preserving the $auth boundary. Callers may set the path, method, body,
     * and additional (non-token) query params and headers.
     *
     * @param {object} opts
     * @param {object} [opts.$] - The Pipedream step context.
     * @param {string} opts.path - The API path (e.g. "/functions/v1/events").
     * @param {object} [opts.headers] - Extra headers, merged over the defaults.
     * @param {object} [opts.params] - Extra query params, merged with the token.
     * @returns {Promise<object>} The parsed API response.
     */
    _makeRequest({
      $ = this, path, headers, params, ...opts
    } = {}) {
      return axios($, {
        ...opts,
        method: opts.method ?? "GET",
        baseURL: this._baseUrl(),
        url: path,
        params: {
          ...params,
          token: this._sourceToken(),
        },
        headers: {
          "content-type": "application/json",
          ...headers,
        },
      });
    },
    /**
     * Sends an event to the ITOC360 inbound events endpoint.
     *
     * @param {object} opts
     * @param {object} [opts.$] - The Pipedream step context.
     * @param {object} opts.data - The event payload (title, status, id,
     * severity, message).
     * @returns {Promise<object>} The parsed API response.
     */
    async sendEvent({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/functions/v1/events",
        data,
      });
    },
  },
};