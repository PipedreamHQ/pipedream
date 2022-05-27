import { v1 } from "@datadog/datadog-api-client@1.0.0-beta.8";
import { v4 as uuid } from "uuid";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "datadog",
  propDefinitions: {
    host: {
      type: "string",
      label: "Host",
      description: "The name of the host that produced the metric",
      async options({ prevContext }) {
        const start = prevContext.totalReturned ?? 0;
        const {
          hostList,
          totalReturned,
        } = await this.listHosts({
          start,
        });
        return {
          options: hostList.map((host) => host.name),
          context: {
            totalReturned: start + totalReturned,
          },
        };
      },
    },
    metric: {
      type: "string",
      label: "Metric",
      description: "The name of the timeseries",
      async options({ host }) {
        const { metrics } = await this.listActiveMetrics({
          from: 1,
          host,
        });
        return metrics;
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags associated with the metric",
      optional: true,
      async options({ hostName }) {
        const { tags } = await this.listTags({
          hostName,
        });
        return tags;
      },
    },
    metricType: {
      type: "string",
      label: "Metric Type",
      description: "The type of the metric",
      options: constants.metricTypes,
    },
  },
  methods: {
    _v1Config() {
      return v1.createConfiguration({
        authMethods: {
          apiKeyAuth: this.$auth.api_key,
          appKeyAuth: this.$auth.application_key,
        },
      });
    },
    _webhooksApi() {
      return new v1.WebhooksIntegrationApi(this._v1Config());
    },
    _monitorsApi() {
      return new v1.MonitorsApi(this._v1Config());
    },
    _hostsApi() {
      return new v1.HostsApi(this._v1Config());
    },
    _tagsApi() {
      return new v1.TagsApi(this._v1Config());
    },
    _metricsApi() {
      return new v1.MetricsApi(this._v1Config());
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
      return this._monitorsApi().getMonitor({
        monitorId,
      });
    },
    async _editMonitor(monitorId, monitorChanges) {
      await this._monitorsApi().updateMonitor({
        monitorId,
        body: monitorChanges,
      });
    },
    async *_searchMonitors(query) {
      let page = 0;
      let pageCount;
      let perPage;
      do {
        const params = {
          page,
          query,
        };
        const {
          monitors,
          metadata,
        } = await this._monitorsApi().searchMonitors(params);
        for (const monitor of monitors) {
          yield monitor;
        }
        ++page;
        pageCount = metadata.pageCount;
        perPage = metadata.perPage;
      } while (pageCount === perPage);
    },
    async listMonitors(page, pageSize) {
      return this._monitorsApi().listMonitors({
        page,
        pageSize,
      });
    },
    async createWebhook(
      url,
      payloadFormat = null,
      secretKey = uuid(),
    ) {
      const name = `pd-${uuid()}`;
      const customHeaders = {
        [this._webhookSecretKeyHeader()]: secretKey,
      };
      await this._webhooksApi().createWebhooksIntegration({
        body: {
          customHeaders: JSON.stringify(customHeaders),
          payload: JSON.stringify(payloadFormat),
          name,
          url,
        },
      });
      return {
        name,
        secretKey,
      };
    },
    async deleteWebhook(webhookName) {
      await this._webhooksApi().deleteWebhooksIntegration({
        webhookName,
      });
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
        `\n?${this._webhookTagPattern(webhookName)}`,
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
    async listHosts(params) {
      return this._hostsApi().listHosts(params);
    },
    async listTags(params) {
      return this._tagsApi().getHostTags(params);
    },
    async listActiveMetrics(params) {
      return this._metricsApi().listActiveMetrics(params);
    },
    async postMetricData(params) {
      return this._metricsApi().submitMetrics({
        body: params,
      });
    },
  },
};
