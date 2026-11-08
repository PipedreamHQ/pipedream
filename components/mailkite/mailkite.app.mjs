import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailkite",
  propDefinitions: {
    domainId: {
      type: "string",
      label: "Domain",
      description:
        "A MailKite domain that is **MX-verified** (required to receive inbound email).",
      async options() {
        // GET /api/domains returns a bare array of domain rows
        // ({ id, domain, mx_verified, ... }) — see MailKite api/src/index.ts.
        const domains = await this.listDomains();
        return (domains ?? [])
          .filter((d) => d.mx_verified)
          .map((d) => ({
            label: d.domain,
            value: d.id,
          }));
      },
    },
  },
  methods: {
    /**
     * Base URL of the MailKite REST API. Every path below is relative to it.
     *
     * @returns {string} The API origin, without a trailing slash.
     */
    _baseUrl() {
      return "https://api.mailkite.dev";
    },
    /**
     * Auth and content headers sent with every request. The `api_key` auth field is
     * provisioned by Pipedream when the app is created; a `mk_live_…` key is accepted on
     * both `/api/domains*` and `/v1/send`.
     *
     * @returns {object} Headers for a MailKite API request.
     */
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    /**
     * Issue a request against the MailKite API.
     *
     * @param {object} opts - Request options, passed through to `@pipedream/platform` axios.
     * @param {object} [opts.$] - Pipedream step context, for logging/observability. Defaults
     * to `this` (the component), which is what a source without a step context should pass.
     * @param {string} opts.path - API path beginning with `/`, e.g. `/api/domains`.
     * @returns {Promise<*>} The parsed response body.
     */
    async _request({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * List the domains the authenticated account can use — `GET /api/domains`. Used by the
     * domain async-options picker. A domain-scoped API key sees exactly one domain.
     *
     * @param {object} [opts={}] - Extra request options (e.g. `$`).
     * @returns {Promise<object[]>} A bare array of domain rows (`{ id, domain, mx_verified, … }`).
     */
    async listDomains(opts = {}) {
      return this._request({
        path: "/api/domains",
        ...opts,
      });
    },
    /**
     * Fetch one domain — `GET /api/domains/:id`. The response is `{ domain, dns }`; only the
     * domain is returned here. Its `webhookUrl` / `webhookAckMode` describe the domain's
     * current catch-all webhook route, which the source stashes before taking it over.
     *
     * @param {object} opts - Request options.
     * @param {string} opts.domainId - Domain id to fetch.
     * @returns {Promise<object>} The domain row, including `webhookUrl` and `webhookAckMode`
     * when a webhook is registered.
     */
    async getDomain({
      domainId, ...opts
    }) {
      const { domain } = await this._request({
        path: `/api/domains/${domainId}`,
        ...opts,
      });
      return domain;
    },
    /**
     * Register (or replace) the domain's catch-all inbound webhook —
     * `PUT /api/domains/:id/webhook`. A domain has exactly one, so this overwrites any
     * incumbent route.
     *
     * @param {object} opts - Request options.
     * @param {string} opts.domainId - Domain to wire up.
     * @param {object} opts.data - Body: `{ url, ackMode }` — `ackMode` is `lenient` or `ack`.
     * @returns {Promise<object>} `{ domain, webhookUrl, ackMode, routeId, signingSecret }`;
     * `signingSecret` is the HMAC key for `x-mailkite-signature` and is returned here only.
     */
    async setWebhook({
      domainId, ...opts
    }) {
      return this._request({
        method: "PUT",
        path: `/api/domains/${domainId}/webhook`,
        ...opts,
      });
    },
    /**
     * Remove the domain's catch-all inbound webhook — `DELETE /api/domains/:id/webhook`.
     * Inbound mail stops being POSTed anywhere, so only call this when the domain had no
     * webhook before the source took it over.
     *
     * @param {object} opts - Request options.
     * @param {string} opts.domainId - Domain whose webhook is removed.
     * @returns {Promise<*>} The API's delete response.
     */
    async deleteWebhook({
      domainId, ...opts
    }) {
      return this._request({
        method: "DELETE",
        path: `/api/domains/${domainId}/webhook`,
        ...opts,
      });
    },
    /**
     * List stored messages, newest first — `GET /api/messages`. The response is a bare array;
     * the caller infers "there is more" from page fullness and pages with `before`.
     *
     * Two things this endpoint does NOT do, both of which the backfill has to handle itself:
     * there is no domain filter (only a `search` substring), so recipients are matched
     * client-side; and the list query omits `text_body`/`html_body`/`headers_json` for payload
     * size, so a row here is not a webhook payload — fetch `getMessage()` for the bodies.
     *
     * @param {object} [opts={}] - Request options.
     * @param {number} [opts.limit] - Page size, 1–200 (the API defaults to 100).
     * @param {number} [opts.before] - Cursor: return only messages with `received_at` below this.
     * @returns {Promise<object[]>} Message list rows (`{ id, direction, from, to, subject,
     * received_at, enc_key_fp, … }`), newest first.
     */
    async listMessages({
      limit, before, ...opts
    } = {}) {
      return this._request({
        path: "/api/messages",
        params: {
          ...(limit === undefined
            ? {}
            : {
              limit,
            }),
          ...(before === undefined
            ? {}
            : {
              before,
            }),
        },
        ...opts,
      });
    },
    /**
     * Fetch one stored message with its attachments — `GET /api/messages/:id`. This is the
     * only place the bodies and the attachment list live; the detail response also carries
     * delivery/event/tracking sections, which are dropped here as the source has no use for
     * them.
     *
     * @param {object} opts - Request options.
     * @param {string} opts.messageId - Message id (`msg_…`).
     * @returns {Promise<{message: object, attachments: object[]}>} The full row (including
     * `text_body`/`html_body` and the structured `from`/`to`) and its attachments, each with a
     * signed 7-day `url`.
     */
    async getMessage({
      messageId, ...opts
    }) {
      const {
        message, attachments,
      } = await this._request({
        path: `/api/messages/${messageId}`,
        ...opts,
      });
      return {
        message,
        attachments: attachments ?? [],
      };
    },
    /**
     * Send an email — `POST /v1/send`.
     *
     * @param {object} [opts={}] - Request options.
     * @param {object} opts.data - Send body. Required: `from`, `to` (string or array), and one
     * of `subject` + `html`/`text` or `templateId`. Optional: `cc`, `bcc`, `replyTo`,
     * `inReplyTo`, `attachments`, `headers`, `templateData`, `scheduledAt`, `trackOpens`,
     * `trackClicks` — the full documented request body (`sdks/spec/schemas/send-request.json`).
     * @returns {Promise<object>} `{ id, status }`, plus `scheduledAt` (ms epoch) when a future
     * `scheduledAt` parked the message: then `status` is `scheduled` and `id` is an `ssnd_…`
     * scheduled-send id, not a `msg_…`.
     */
    async sendEmail(opts = {}) {
      return this._request({
        method: "POST",
        path: "/v1/send",
        ...opts,
      });
    },
  },
};
