const axios = require("axios");
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "sendgrid",
  methods: {
    _authToken() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.sendgrid.com/v3";
    },
    _contactsSearchUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/marketing/contacts/search`;
    },
    _webhookSettingsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/user/webhooks/event/settings`;
    },
    _setSignedWebhookUrl() {
      const baseUrl = this._webhookSettingsUrl();
      return `${baseUrl}/signed`;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this._authToken()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      opts.headers["Content-Type"] = "application/json";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      return (await axios(opts)).data;
    },
    async _getAllItems(params) {
      const { url, query } = params;
      const requestData = {
        query,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      return data;
    },
    _isRetriableStatusCode(statusCode) {
      [408, 429, 500].includes(statusCode);
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
          const statusCode = get(err, ["response", "status"]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.response, null, 2)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    async searchContacts(query) {
      const url = this._contactsSearchUrl();
      const searchParams = {
        url,
        query,
      };
      return this._withRetries(() => this._getAllItems(searchParams));
    },
    async getWebhookSettings() {
      const url = this._webhookSettingsUrl();
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(() => axios.get(url, requestConfig));
    },
    async setWebhookSettings(webhookSettings) {
      const url = this._webhookSettingsUrl();
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(() =>
        axios.patch(url, webhookSettings, requestConfig)
      );
    },
    async _setSignedWebhook(enabled) {
      const url = this._setSignedWebhookUrl();
      const requestData = {
        enabled,
      };
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(() =>
        axios.patch(url, requestData, requestConfig)
      );
    },
    async enableSignedWebhook() {
      const { data } = await this._setSignedWebhook(true);
      return data.public_key;
    },
    async disableSignedWebhook() {
      return this._setSignedWebhook(false);
    },
    async addEmailToGlobalSupression(recipientEmails) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "POST",
          path: `/asm/suppressions/global`,
          data: {
            recipient_emails: recipientEmails,
          },
        })
      );
    },
    async addOrUpdateContacts(params) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "PUT",
          path: `/marketing/contacts`,
          data: params,
        })
      );
    },
    async createContactList(name) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "POST",
          path: `/marketing/lists`,
          data: {
            name,
          },
        })
      );
    },
    async deleteBlocks(deleteAll, emails) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "DELETE",
          path: `/suppression/blocks`,
          data: {
            delete_all: deleteAll,
            emails,
          },
        })
      );
    },
    async deleteBounces(deleteAll, emails) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "DELETE",
          path: `/suppression/bounces`,
          data: {
            delete_all: deleteAll,
            emails,
          },
        })
      );
    },
    async deleteContacts(deleteAllContacts, ids) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "DELETE",
          path: `/marketing/contacts`,
          params: {
            delete_all_contacts: deleteAllContacts,
            ids,
          },
        })
      );
    },
    async deleteGlobalSupression(email) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "DELETE",
          path: `/asm/suppressions/global/${email}`,
        })
      );
    },
    async deleteList(id, deleteContacts) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "DELETE",
          path: `/marketing/lists/${id}`,
          params: {
            delete_contacts: deleteContacts,
          },
        })
      );
    },
    async getBlock(email) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/suppression/blocks/${email}`,
        })
      );
    },
    async getGlobalSupression(email) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/asm/suppressions/global/${email}`,
        })
      );
    },
    async getAllBounces(startTime, endTime) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/suppression/bounces`,
          params: {
            start_time: startTime,
            end_time: endTime,
          },
        })
      );
    },
    async getAllContactLists(pageSize, pageToken) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/marketing/lists`,
          params: {
            page_size: pageSize,
            page_token: pageToken,
          },
        })
      );
    },
    async getAllRecipients(page, pageSize) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/contactdb/recipients`,
          params: {
            page: page,
            page_size: pageSize,
          },
        })
      );
    },
    async listBlocks(startTime, endTime, limit, offset) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/suppression/blocks`,
          params: {
            start_time: startTime,
            end_time: endTime,
            limit,
            offset,
          },
        })
      );
    },
    async listGlobalSupressions(startTime, endTime, limit, offset) {
      return await this._withRetries(() =>
        this._makeRequest({
          path: `/suppression/unsubscribes`,
          params: {
            start_time: startTime,
            end_time: endTime,
            limit,
            offset,
          },
        })
      );
    },
    async makeAnAPICall(method, path, headers, data) {
      const cleanedPath = path
        .replace(/^\/*/, "")
        .replace(/\/*$/, "");
      const url = `${this._apiUrl()}/${cleanedPath}`;
      const { headers: baseHeaders } = this._makeRequestConfig();
      const config = {
        method,
        url,
        headers: {
          ...baseRequestHeaders,
          headers,
        },
        data,
      };
      const { data } = await this._withRetries(() => axios(config));
      return data;
    },
    async removeContactFromList(id, contactIds) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "DELETE",
          path: `/marketing/lists/${id}/contacts`,
          params: {
            contact_ids: contactIds,
          },
        })
      );
    },
    async searchContacts(params) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "POST",
          path: `/marketing/contacts/search`,
          data: params,
        })
      );
    },
    async sendEmail(params) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "post",
          path: `/mail/send`,
          data: params,
        })
      );
    },
    async validateEmail(params) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "POST",
          path: `/validations/email`,
          data: params,
        })
      );
    },
  },
};
