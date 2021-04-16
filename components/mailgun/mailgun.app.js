const axios = require("axios");
const get = require("lodash/get");
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
          options.push({
            label: domains.name,
            value: domains.name,
          });
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
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      const subdomain = this.baseRegion == "EU"
        ? "api.eu"
        : "api";
      return `https://${subdomain}.mailgun.net`;
    },
    async _makeRequest(opts) {
      const credentials = `api:${this._apiKey()}`;
      const base64Credentials = Buffer.from(credentials).toString("base64");
      if (!opts.headers) opts.headers = {};
      opts.headers.Authorization = `Basic ${base64Credentials}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return (await axios(opts)).data;
    },
    _isRetriableStatusCode(statusCode) {
      [402, 429, 500, 502, 503, 504].includes(statusCode);
      //TODO: Remove this comment. For code review purposes, I am linking to Mailgun's HTTP status code returned: https://documentation.mailgun.com/en/latest/api-intro.html?highlight=502#status-codes Errro 408, common in other Pipedream retries documentedly not returned by Mailgun, so it was not included.
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
          path: `/v3/domains`,
          params: {
            skip,
          },
        })
      );
    },
    async getWebhookDetails(mailgunDomain, webhookName) {
      const webhooks = await this._withRetries(() =>
        this._makeRequest({
          path: `/v3/domains/${mailgunDomain}/webhooks`,
          method: "get",
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
          path: `v3/domains/${mailgunDomain}/webhooks`,
          params: {
            domain: mailgunDomain,
            url: webhookUrl,
            id: webhookName,
          },
        })
      );
    },
    async updateWebhook(mailgunDomain, webhookName, webhookUrls) {
      const FormData = require("form-data");
      data = new FormData();
      data.append("domain", mailgunDomain);
      data.append("webhookname", webhookName);
      webhookUrls.forEach((url) => {
        data.append("url", url);
      });
      const opts = {
        method: "put",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
        path: `v3/domains/${mailgunDomain}/webhooks/${webhookName}`,
        data,
      };
      return await this._withRetries(() => this._makeRequest(opts));
    },
    async deleteWebhook(mailgunDomain, webhookName) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "delete",
          path: `v3/domains/${mailgunDomain}/webhooks/${webhookName}`,
        })
      );
    },
  },
};
