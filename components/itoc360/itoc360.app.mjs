import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "itoc360",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.itoc360.app/functions/v1/events";
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
     * Performs an authenticated request against the ITOC360 inbound events API.
     * The source token is read from the connected account and sent as a query
     * parameter. Caller-supplied headers are merged on top of the defaults.
     *
     * @param {object} opts - Axios-style request options. `$` may be passed for
     * the Pipedream step context; `headers` are merged with the defaults.
     * @returns {Promise<object>} The parsed API response.
     */
    _makeRequest({
      $ = this, headers, ...opts
    } = {}) {
      return axios($, {
        ...opts,
        url: this._baseUrl(),
        params: {
          token: this._sourceToken(),
          ...opts.params,
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
     * @param {object} opts.data - The event payload (title, status, id,
     * severity, message).
     * @returns {Promise<object>} The parsed API response.
     */
    async sendEvent({
      data, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        data,
        ...opts,
      });
    },
  },
};