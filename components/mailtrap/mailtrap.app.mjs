import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailtrap",
  propDefinitions: {
    domainId: {
      type: "string",
      label: "Domain",
      description: "A sending domain verified in your Mailtrap account (numeric domain ID, e.g. `831941`).",
      async options() {
        const { data: domains } = await this.listDomains({});
        return domains.map(({
          id, domain_name: domainName,
        }) => ({
          label: domainName,
          value: id,
        }));
      },
    },
    suppressionId: {
      type: "string",
      label: "Suppression",
      description:
        "The suppression ID to remove from the suppression list (associated with the email address.)," +
        " e.g. `25bac214-6fce-4939-bee3-abcdc8f982a8`.",
      async options({ prevContext }) {
        const { lastId } = prevContext ?? {};
        const suppressions = await this.listSuppressions({
          params: {
            ...(lastId && {
              last_id: lastId,
            }),
          },
        });
        const options = suppressions.map(({
          id, email,
        }) => ({
          label: email,
          value: id,
        }));
        const isFullPage = suppressions.length === 1000;
        if (!isFullPage) {
          return {
            options,
          };
        }
        return {
          options,
          context: {
            lastId: suppressions[suppressions.length - 1].id,
          },
        };
      },
    },
  },
  methods: {
    /**
     * Build the auth headers sent with every Mailtrap API request.
     *
     * @returns {object} Header object with `Authorization` and `Content-Type`.
     */
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token || this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    /**
     * Shared request helper used by every public method below. Centralizes
     * auth headers and base URL resolution.
     *
     * @param {object} opts - Request options.
     * @param {object} [opts.$=this] - Pipedream step reference, used for
     * HTTP request/response export.
     * @param {string} [opts.baseURL="https://send.api.mailtrap.io"] - Base
     * URL for the request (sending API vs. account API host).
     * @param {string} opts.endpoint - API path to call, appended to `baseURL`.
     * @returns {Promise<object>} The parsed JSON response body.
     */
    async _httpRequest({
      $ = this,
      baseURL = "https://send.api.mailtrap.io",
      endpoint,
      ...customConfig
    }) {
      return axios($, {
        url: `${baseURL}${endpoint}`,
        headers: this._getHeaders(),
        ...customConfig,
      });
    },
    /**
     * Send a transactional email.
     *
     * @param {object} opts - Method options.
     * @param {object} [opts.$] - Pipedream step reference.
     * @param {object} opts.data - Request body matching the Mailtrap Send
     * Email API schema (`from`, `to`, `subject`, `text`/`html`, etc.).
     * @returns {Promise<object>} `{ success, message_ids }`.
     */
    async sendEmail(args = {}) {
      const {
        $, data,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://send.api.mailtrap.io",
        endpoint: "/api/send",
        method: "POST",
        data,
      });
    },
    /**
     * Retrieve delivery status, events, and metadata for a previously sent email.
     *
     * @param {object} opts - Method options.
     * @param {object} [opts.$] - Pipedream step reference.
     * @param {string} opts.sendingMessageId - The `sending_message_id`
     * returned when the email was sent.
     * @returns {Promise<object>} The email log entry, including `status` and `events`.
     */
    async getEmailState(args = {}) {
      const {
        $, sendingMessageId,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: `/api/email_logs/${sendingMessageId}`,
        method: "GET",
      });
    },
    /**
     * List sending domains configured on the account.
     *
     * @param {object} opts - Method options.
     * @param {object} [opts.$] - Pipedream step reference.
     * @returns {Promise<object>} `{ data: Domain[] }`.
     */
    async listDomains(args = {}) {
      const { $ } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: "/api/domains",
        method: "GET",
      });
    },
    /**
     * List suppressed email addresses.
     *
     * @param {object} opts - Method options.
     * @param {object} [opts.$] - Pipedream step reference.
     * @param {object} [opts.params] - Query params, e.g. `{ email, last_id }`
     * (`last_id` pages past the first 1,000 results).
     * @returns {Promise<Array>} Array of suppression entries.
     */
    async listSuppressions(args = {}) {
      const {
        $, params,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: "/api/suppressions",
        method: "GET",
        params,
      });
    },
    /**
     * Manually add an email address to the suppression list.
     *
     * @param {object} opts - Method options.
     * @param {object} [opts.$] - Pipedream step reference.
     * @param {object} opts.data - Request body: `{ email, domain_id,
     * sending_stream, [type="manual import"] }`.
     * @returns {Promise<object>} `{ data: Suppression }`.
     */
    async createSuppression(args = {}) {
      const {
        $, data,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: "/api/suppressions",
        method: "POST",
        data,
      });
    },
    /**
     * Remove an email address from the suppression list.
     *
     * @param {object} opts - Method options.
     * @param {object} [opts.$] - Pipedream step reference.
     * @param {string} opts.suppressionId - The `id` of the suppression entry to delete.
     * @returns {Promise<object>} The deleted suppression entry.
     */
    async deleteSuppression(args = {}) {
      const {
        $, suppressionId,
      } = args;
      return this._httpRequest({
        $,
        baseURL: "https://mailtrap.io",
        endpoint: `/api/suppressions/${suppressionId}`,
        method: "DELETE",
      });
    },
  },
};
