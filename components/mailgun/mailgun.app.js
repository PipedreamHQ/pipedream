const axios = require("axios");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const get = require("lodash.get");
const moment = require("moment");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "mailgun",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain Name",
      async options({ page }) {
        const query = {
          limit: 50,
          skip: 50 * page,
        };
        const domains = await this.api("domains").list(query);
        return domains.map((domain) => domain.name);
      },
    },
    email: {
      type: "string",
      label: "Email Address",
    },
    haltOnError: {
      type: "boolean",
      label: "Halt on error?",
      default: true,
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Mailgun for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes.
      },
    },
    webhookSigningKey: {
      type: "string",
      secret: true,
      label: "Mailgun webhook signing key",
      description:
        "Your Mailgun webhook signing key, found " +
        "[in your Mailgun dashboard](https://app.mailgun.com/app/dashboard), located under " +
        "Settings on the left-hand nav and then in API Keys look for webhook signing key. " +
        "Required to compute the authentication signature of events.",
    },
  },
  methods: {
    api(api) {
      const config = {
        username: "api",
        key: this.$auth.api_key,
        public_key: this.$auth.api_key,
      };
      if (this.$auths.region === "EU") {
        config.url = "https://api.eu.mailgun.net";
      }
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client(config);
      return mg[api];
    },
    async suppress(domain, type, suppression) {
      const d = encodeURIComponent(domain);
      const t = encodeURIComponent(type);
      const config = {
        url: `https://api.mailgun.net/v3/${d}/${t}`,
        method: "POST",
        auth: {
          username: "api",
          password: this.$auth.api_key,
        },
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify(
          Array.isArray(suppression)
            ? suppression
            : [
              suppression,
            ],
        ),
      };
      if (this.$auths.region === "EU") {
        config.url = `https://api.eu.mailgun.net/v3/${d}/${t}`;
      }
      const res = await axios(config);
      return res.data;
    },
    _mailgun(apiKey, domain, host) {
      return require("mailgun-js")({
        apiKey,
        domain,
        host,
      });
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiHost() {
      const subdomain = this.baseRegion == "EU"
        ? "api.eu"
        : "api";
      return `${subdomain}.mailgun.net`;
    },
    async _makeRequest(opts) {
      const {
        domain,
        method,
        path,
        params,
      } = opts;
      const mailgun = this._mailgun(this._apiKey(), domain, this._apiHost());
      switch (method) {
      case "GET":
        return mailgun.get(path, params);
      case "POST":
        return mailgun.post(path, params);
      case "PUT":
        return mailgun.put(path, params);
      case "DELETE":
        return mailgun.delete(path, params);
      default:
        return;
      }
    },
    _isRetriableStatusCode(statusCode) {
      [
        402,
        429,
        500,
        502,
        503,
        504,
      ].includes(statusCode);
      // More info on  Mailgun HTTP response codes:
      // https://documentation.mailgun.com/en/latest/api-intro.html?highlight=502#status-codes
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.response)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    /**
     * Get a list of domains under the connected Mailgun account.
     *
     * @param {Integer} skip - Number of records to skip (0 by default).
     * @returns {total_count: integer, items: array} Object with the total count of domains in the
     * Mailgun account, and the items array with the domain records. Records are queried in batches
     * of 100 records each.
     */
    async getDomains(skip) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "GET",
          path: "/domains",
          params: {
            skip,
          },
        }));
    },
    /**
     * Get a list with the entire set of domains under the connected Mailgun account.
     *
     * @returns {Array} Array with the entire set of domains under the connected Mailgun account.
     */
    async getAllDomains() {
      let domains;
      const results = [];
      let skip = 0;
      do {
        domains = await this.getDomains(skip);
        domains.items.forEach((domain) => {
          results.push({
            name: domain.name,
          });
        });
        skip += domains.items.length || 0;
      } while (domains.items.length);
      return results;
    },
    /**
     * Get a list of URLs that are subscribed to a specific webhook in a given domain.
     *
     * @param {String} domain - Domain name
     * @param {String} webhook - Webhook name (see
     * https://documentation.mailgun.com/en/latest/api-webhooks.html
     * for a list of supported webhooks)
     * @returns {Array} Array of subscribed URLs
     */
    async getWebhook(domain, webhook) {
      const response = await this.api('request').get(`/domains/${domain}/webhooks/${webhook}`);
      return response.body.webhook.urls;
    },
    /**
     * Creates a new webhook.
     *
     * @param {String} domain - Domain name
     * @param {String} webhook - Webhook name (see
     * https://documentation.mailgun.com/en/latest/api-webhooks.html
     * for a list of supported webhooks)
     * @param {Array} urls - Array of URLs for the webhook event
     * @returns {Array} Array of subscribed URLs
     */
    async createWebhook(domain, webhook, urls) {
      const response = await this.api('request').post(`/domains/${domain}/webhooks`, {
        id: webhook, url: urls
      });
      return response.body.webhook.urls;
    },
    /**
     * Update an existing webhook.
     *
     * @param {String} domain - Domain name
     * @param {String} webhook - Webhook name (see
     * https://documentation.mailgun.com/en/latest/api-webhooks.html
     * for a list of supported webhooks)
     * @param {Array} urls - Array of URLs for the webhook event
     * @returns {Array} Array of subscribed URLs
     */
    async updateWebhook(domain, webhook, urls) {
      const response = await this.api('request').put(`/domains/${domain}/webhooks/${webhook}`, {
        url: urls
      });
      return response.body.webhook.urls;
    },
    /**
     * Delete a webhook.
     *
     * @param {String} domain - Domain name
     * @param {String} webhook - Webhook name (see
     * https://documentation.mailgun.com/en/latest/api-webhooks.html
     * for a list of supported webhooks)
     * @returns {Array} Array of subscribed URLs
     */
    async deleteWebhook(domain, webhook) {
      const response = await this.api('request').delete(`/domains/${domain}/webhooks/${webhook}`);
      return response.body.webhook.urls;
    },
    /**
     * Get a list of Mailgun event under a given domain occured
     *
     * @param {String} mailgunDomain - Name of the Mailgun domain where the events are located.
     * @param {String} [nextId = null] - The index of the next page with events to return.
     * @param {Integer} [limit = 300] - The max number of event entries to return on each page.
     * @returns {items: Array, paging: Object } An object with an array of event items, and a
     * paging object to enable pagination over the events matched by the request query.
     */
    async getMailgunEvents(mailgunDomain, nextId = null, limit = 300) {
      const nextPathPart = nextId
        ? `/${nextId}`
        : "";
      const begin = moment().subtract(1, "days")
        .unix();
      return await this._makeRequest({
        method: "GET",
        path: `/${mailgunDomain}/events${nextPathPart}`,
        params: {
          begin,
          ascending: "yes",
          limit,
        },
      });
    },
    /**
     * Get a page of mailing lists available under the connected Mailgun account
     *
     * @param {String} page - Page number of results to fetch.
     * @param {Integer} [limit = 100] - Max number of items to return per page.
     * @returns {items: Array, paging: Object } An object with an array of mailing list items, and a
     * paging object to enable pagination over all available mailing lists.
     */
    async getMailgunLists(page, limit = 100) {
      let params = {
        page,
        limit,
      };
      return await this._makeRequest({
        method: "GET",
        path: "/lists/pages",
        params,
      });
    },
  },
};
