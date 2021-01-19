const axios = require("axios");
const { v4: uuid } = require("uuid");

module.exports = {
  type: "app",
  app: "datadog",
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _applicationKey() {
      return this.$auth.application_key;
    },
    _baseUrl() {
      return (
        this.$auth.base_url ||
        "https://api.datadoghq.com/api/v1"
      );
    },
    _webhooksUrl(name) {
      const baseUrl = this._baseUrl();
      const basePath = "/integration/webhooks/configuration/webhooks";
      const path = name ? `${basePath}/${name}` : basePath;
      return `${baseUrl}${path}`;
    },
    _monitorsUrl(id) {
      const baseUrl = this._baseUrl();
      const basePath = "/monitor";
      const path = id ? `${basePath}/${id}` : basePath;
      return `${baseUrl}${path}`;
    },
    _monitorsSearchUrl() {
      const baseUrl = this._baseUrl();
      return `${baseUrl}/monitor/search`;
    },
    _makeRequestConfig() {
      const apiKey = this._apiKey();
      const applicationKey = this._applicationKey();
      const headers = {
        "DD-API-KEY": apiKey,
        "DD-APPLICATION-KEY": applicationKey,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _webhookSecretKeyHeader() {
      return "x-webhook-secretkey";
    },
    _webhookTagPattern(webhookName) {
      return `@webhook-${webhookName}`;
    },
    isValidSource(event, secretKey) {
      const { headers } = event;
      return headers[this._webhookSecretKeyHeader()] === secretKey;
    },
    async _getMonitor(monitorId) {
      const apiUrl = this._monitorsUrl(monitorId);
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.get(apiUrl, requestConfig);
      return data;
    },
    async _editMonitor(monitorId, monitorChanges) {
      const apiUrl = this._monitorsUrl(monitorId);
      const requestConfig = this._makeRequestConfig();
      await axios.put(apiUrl, monitorChanges, requestConfig);
    },
    async *_searchMonitors(query) {
      const apiUrl = this._monitorsSearchUrl();
      const baseRequestConfig = this._makeRequestConfig();
      let page = 0;
      let pageCount;
      let perPage;
      do {
        const params = {
          page,
          query,
        };
        const requestConfig = {
          ...baseRequestConfig,
          params,
        };
        const {
          data: {
            monitors,
            metadata,
          },
        } = await axios.get(apiUrl, requestConfig);
        for (const monitor of monitors) {
          yield monitor;
        }

        ++page;
        pageCount = metadata.page_count;
        perPage = metadata.per_page;
      } while (pageCount === perPage);
    },
    async listMonitors(page, pageSize) {
      const apiUrl = this._monitorsUrl();
      const baseRequestConfig = this._makeRequestConfig();
      const params = {
        page,
        page_size: pageSize,
      };
      const requestConfig = {
        ...baseRequestConfig,
        params,
      };
      const { data } = await axios.get(apiUrl, requestConfig);
      return data;
    },
    async createWebhook(
      url,
      payloadFormat = null,
      secretKey = uuid(),
    ) {
      const apiUrl = this._webhooksUrl();
      const requestConfig = this._makeRequestConfig();

      const name = `pd-${uuid()}`;
      const customHeaders = {
        [this._webhookSecretKeyHeader()]: secretKey,
      };
      const requestData = {
        custom_headers: JSON.stringify(customHeaders),
        payload: JSON.stringify(payloadFormat),
        name,
        url,
      };

      await axios.post(apiUrl, requestData, requestConfig);
      return {
        name,
        secretKey,
      };
    },
    async deleteWebhook(webhookName) {
      const apiUrl = this._webhooksUrl(webhookName);
      const requestConfig = this._makeRequestConfig();
      await axios.delete(apiUrl, requestConfig);
    },
    async addWebhookNotification(webhookName, monitorId) {
      const { message } = await this._getMonitor(monitorId);
      const webhookTagPattern = this._webhookTagPattern(webhookName);
      if (new RegExp(webhookTagPattern).test(message)) {
        // Monitor is already notifying this webhook
        return;
      }

      const newMessage = `${message}\n${webhookTagPattern}`;
      const monitorChanges = {
        message: newMessage,
      };
      await this._editMonitor(monitorId, monitorChanges);
    },
    async removeWebhookNotifications(webhookName) {
      // Users could have manually added this webhook in other monitors, or
      // removed the webhook from the monitors specified as user props. Hence,
      // we need to search through all the monitors that notify this webhook and
      // remove the notification.
      const webhookTagPattern = new RegExp(
        `\n?${this._webhookTagPattern(webhookName)}`
      );
      const monitorSearchResults = this._searchMonitors(webhookName);
      for await (const monitorInfo of monitorSearchResults) {
        const { id: monitorId } = monitorInfo;
        const { message } = await this._getMonitor(monitorId);

        if (!new RegExp(webhookTagPattern).test(message)) {
          // Monitor is not notifying this webhook, skip it...
          return;
        }


        const newMessage = message.replace(webhookTagPattern, "");
        const monitorChanges = {
          message: newMessage,
        };
        await this._editMonitor(monitorId, monitorChanges);
      }
    },
  },
};
