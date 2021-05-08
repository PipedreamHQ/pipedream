const axios = require("axios");
const get = require("lodash/get");
const moment = require("moment");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "mailgun",
  propDefinitions: {
    domain: {
      type: "string",
      label: "domain",
      description: "Domain used to send and receive email.",
      async options(context) {
        const q = context.query;
        const options = [];
        const results = await this.getAllDomains();
        for (const domains of results) {
          options.push(domains.name);
        }
        return options;
      },
    },
    baseRegion: {
      type: "string",
      label: "Base region",
      description:
        'The region that Mailgun will use to send and receive email, which determines the URL to use when requesting Mailgun API. This must be the same region where "domain" was created.',
      default: "US",
      options: ["US", "EU"],
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes.
      },
    },
  },
  methods: {
    mailgun(apiKey, domain, host) {
      return require("mailgun-js")({ apiKey, domain, host });
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiHost() {
      const subdomain = this.baseRegion == "EU" ? "api.eu" : "api";
      return `${subdomain}.mailgun.net`;
    },
    async _makeRequest(opts) {
      const mailgun = this.mailgun(
        this._apiKey(),
        opts.domain,
        this._apiHost()
      );
      switch (opts.method) {
        case "get":
          return mailgun.get(opts.path, opts.params);
        case "post":
          return mailgun.post(opts.path, opts.params);
        case "put":
          return mailgun.put(opts.path, opts.params);
        case "delete":
          return mailgun.delete(opts.path, opts.params);
        default:
          return;
      }
    },
    _isRetriableStatusCode(statusCode) {
      [402, 429, 500, 502, 503, 504].includes(statusCode);
      //More info on  Mailgun HTTP response codes: https://documentation.mailgun.com/en/latest/api-intro.html?highlight=502#status-codes
    },
    async _withRetries(apiCall, allow404 = false) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, ["response", "status"]);
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
    async getDomains(skip) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "get",
          path: `/domains`,
          params: {
            skip,
          },
        })
      );
    },
    async getWebhookDetails(mailgunDomain, webhookName) {
      const webhooks = await this._withRetries(() =>
        this._makeRequest({
          method: "get",
          path: `/domains/${mailgunDomain}/webhooks`,
        })
      );
      return get(webhooks, `webhooks.${webhookName}`);
    },
    async getAllDomains() {
      let domains_set;
      const results = [];
      let skip = 0;
      do {
        domains_set = await this.getDomains(skip);
        domains_set.items.forEach((domain) => {
          results.push({
            name: domain.name,
          });
        });
        skip += domains_set.items.length || 0;
      } while (domains_set.items.length);
      return results;
    },
    async createWebhook(mailgunDomain, webhookName, webhookUrl) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "post",
          path: `/domains/${mailgunDomain}/webhooks`,
          params: {
            domain: mailgunDomain,
            url: webhookUrl,
            id: webhookName,
          },
        })
      );
    },
    async updateWebhook(mailgunDomain, webhookName, webhookUrls) {
      const opts = {
        method: "put",
        path: `/domains/${mailgunDomain}/webhooks/${webhookName}`,
        params: {
          domain: mailgunDomain,
          webhookname: webhookName,
          url: webhookUrls,
        },
      };
      return await this._withRetries(() => this._makeRequest(opts));
    },
    async deleteWebhook(mailgunDomain, webhookName) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "delete",
          path: `/domains/${mailgunDomain}/webhooks/${webhookName}`,
        })
      );
    },
    async getMailgunEvents(mailgunDomain, nextId = null, limit = 300) {
      const nextPathPart = nextId ? `/${nextId}` : "";
      const begin = moment().subtract(1, "days").unix();
      return await this._makeRequest({
        method: "get",
        path: `/${mailgunDomain}/events${nextPathPart}`,
        params: {
          begin,
          ascending: "yes",
          limit,
        },
      });
    },
    async getMailgunLists(page, limit = 100, address = null) {
      let params = {
        page,
        limit,
      };
      if (address) {
        params["address"] = address;
      }
      return await this._makeRequest({
        method: "get",
        path: "/lists/pages",
        params,
      });
    },
  },
};
