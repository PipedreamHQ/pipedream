const mailchimp = require("@mailchimp/mailchimp_marketing");
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "mailchimp",
  propDefinitions: {
    server: {
      type: "string",
      label: "server",
      description:
        "The Mailchimp server of the connected account. Found when logging into the Mailchimp account and looking at the URL on a browser. E.g. for https://us19.admin.mailchimp.com/; the us19 part is the server prefix.",
    },
    timer: {
      label: "Polling schedule",
      description: "Pipedream polls Reddit for events on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 120, // by default, run every 15 minutes.
      },
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _mailchimp(server) {
      const mailchimp = require("@mailchimp/mailchimp_marketing");
      mailchimp.setConfig({
        accessToken: this._authToken(),
        server,
      });
      return mailchimp;
    },
    _mailchimpTrx(server) {
      const mailchimp = require("@mailchimp/mailchimp_transactional");
      mailchimp.setConfig({
        accessToken: this._authToken(),
        server,
      });
      return mailchimp;
    },
    //#region
    async _makeRequest(opts) {
      const credentials = `api:${this._apiKey()}`;
      const base64Credentials = Buffer.from(credentials).toString("base64");
      if (!opts.headers) opts.headers = {};
      opts.headers.Authorization = `Basic ${base64Credentials}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      console.log(`[_makeRequest]${path}`);
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return (await axios(opts)).data;
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
    //#endregion
    async createWebhook(server,listId, webhookUrl, events, sources) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(
        () =>
           mailchimp.lists.createListWebhook(listId, {
            url: webhookUrl,
            events,
            sources,
          })
      );
    },
    //Space for updateWbehook
    async deleteWebhook(server,listId,webhookId) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.lists.deleteListWebhook(
          listId,
          webhookId
        )
      );
    },
    async getMailgunEvents(mailgunDomain, nextId = null) {
      const nextPathPart = nextId ? `/${nextId}` : "";
      const mailgun = require("mailgun-js")({
        apiKey: this._apiKey(),
        domain: mailgunDomain,
      });
      return (mailgunEvents = await mailgun.get(
        `/${mailgunDomain}/events${nextPathPart}`,
        { limit: 300 }
      ));
    },
    printSomething() {
      console.log(`[print something]`);
      return "print something";
    },
  },
};
