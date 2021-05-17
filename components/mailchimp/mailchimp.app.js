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
        intervalSeconds: 60, // by default, run every 15 minutes.
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
    _statusIsSent(status) {
      return ["status"].includes(status);
    },
    async createWebhook(server, listId, webhookUrl, events, sources) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.lists.createListWebhook(listId, {
          url: webhookUrl,
          events,
          sources,
        })
      );
    },
    async deleteWebhook(server, listId, webhookId) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.lists.deleteListWebhook(listId, webhookId)
      );
    },
    async getMailchimpAudienceLists(
      server,
      count,
      offset,
      beforeDateCreated,
      sinceDateCreated
    ) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.lists.getAllLists({
          count,
          offset,
          beforeDateCreated,
          sinceDateCreated,
          sortField: "date_created",
          sortDir: "DESC",
        })
      );
    },
    async getMailchimpCampaigns(
      server,
      count,
      offset,
      status,
      beforeDate,
      sinceDate
    ) {
      let opts = { count, offset, status, sortDir: "DESC" };
      if (this._statusIsSent(status)) {
        opts.beforeSendTime = beforeDate;
        opts.sinceSendTime = sinceDate;
        opts.sortField = "send_time";
      } else {
        opts.beforeCreateTime = beforeDate;
        opts.sinceCreateTime = sinceDate;
        opts.sortField = "create_time";
      }
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() => mailchimp.campaigns.list(opts));
    },
    async getSegmentMembersList(
      server,
      listId,
      segmentId,
      count,
      offset,
      includeTransactional
    ) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.lists.getSegmentMembersList(listId, segmentId, {
          count,
          offset,
          includeTransactional,
          includeUnsubscribed: false,
        })
      );
    },
    async getAllFiles(
      server,
      count,
      offset,
      type = null,
      beforeCreatedAt,
      sinceCreatedAt
    ) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.fileManager.files({
          count,
          offset,
          type,
          beforeCreatedAt,
          sinceCreatedAt,
        })
      );
    },
    async getAllStoreCustomers(server, storeId, count, offset) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.ecommerce.getAllStoreCustomers(storeId, {
          count,
          offset,
        })
      );
    },
    async getAllOrders(
      server,
      storeId = null,
      count,
      offset,
      campaignId,
      outreachId,
      customerId,
      hasOutreach
    ) {
      const opts = {
        count,
        offset,
        campaignId,
        outreachId,
        customerId,
        hasOutreach,
      };
      const mailchimp = this._mailchimp(server);
      if (storeId) {
        return await this._withRetries(() =>
          mailchimp.ecommerce.getStoreOrders(storeId, opts)
        );
      }
      return await this._withRetries(() => mailchimp.ecommerce.orders(opts));
    },
    async getMailchimpCampaignInfo(server, campaignId) {
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() => mailchimp.campaigns.get(campaignId));
    },
    async getAudienceSegments(
      server,
      listId,
      count,
      offset,
      sinceCreatedAt,
      beforeCreatedAt,
      sinceUpdatedAt,
      beforeUpdatedAt
    ) {
      let opts = { count, offset };
      if (sinceCreatedAt && beforeCreatedAt) {
        opts.sinceCreatedAt = sinceCreatedAt;
        opts.beforeCreatedAt = beforeCreatedAt;
      } else {
        opts.sinceUpdatedAt = sinceUpdatedAt;
        opts.beforeUpdatedAt = beforeUpdatedAt;
      }
      console.log(JSON.stringify(opts));
      const mailchimp = this._mailchimp(server);
      return await this._withRetries(() =>
        mailchimp.lists.listSegments(listId, opts)
      );
    },
  },
};
