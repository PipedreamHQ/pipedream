import { axios } from "@pipedream/platform";
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
          query: {
            start,
          },
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
          query: {
            from: 1,
            host,
          },
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
          query: {
            hostName,
          },
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
    monitors: {
      type: "integer[]",
      label: "Monitors",
      description: "The monitors to observe for notifications",
      async options({ page }) {
        const monitors = await this.listMonitors({
          query: {
            page,
            pageSize: 1000,
          },
        });

        return monitors.map((monitor) => ({
          label: monitor.name,
          value: monitor.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _applicationKey() {
      return this.$auth.application_key;
    },
    _apiUrl() {
      return "https://api.datadoghq.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "DD-API-KEY": this._apiKey(),
          "DD-APPLICATION-KEY": this._applicationKey(),
        },
        ...args,
      });
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
      return this._makeRequest({
        path: `/v1/monitor/${monitorId}`,
      });
    },
    async _editMonitor({
      monitorId, ...args
    }) {
      if (!monitorId) return;

      return this._makeRequest({
        path: `/v1/monitor/${monitorId}`,
        method: "put",
        ...args,
      });
    },
    async *_searchMonitors({ ...args }) {
      let page = 0;
      let pageCount;
      let perPage;
      do {
        const {
          monitors,
          metadata,
        } = await this._makeRequest({
          path: "/v1/monitor/search",
          query: {
            ...args.query,
            page,
          },
          ...args,
        });
        for (const monitor of monitors) {
          yield monitor;
        }
        ++page;
        pageCount = metadata.pageCount;
        perPage = metadata.perPage;
      } while (pageCount === perPage);
    },
    async createWebhook(
      url,
      payloadFormat = null,
      secretKey = uuid(),
    ) {
      const name = `pd-${uuid()}`;

      await this._makeRequest({
        path: "/v1/integration/webhooks/configuration/webhooks",
        method: "post",
        data: {
          custom_headers: JSON.stringify({
            "x-webhook-secretkey": secretKey,
          }),
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
      if (!webhookName) return;

      await this._makeRequest({
        path: `/v1/integration/webhooks/configuration/webhooks/${webhookName}`,
        method: "delete",
      });
    },
    async addWebhookNotification(webhookName, monitorId) {
      const { message } = await this._getMonitor(monitorId);
      const webhookTagPattern = this._webhookTagPattern(webhookName);
      if (new RegExp(webhookTagPattern).test(message)) {
        // Monitor is already notifying this webhook
        console.log("Monitor is already notifying this webhook");
        return;
      }

      const newMessage = `${message}\n${webhookTagPattern}`;
      await this._editMonitor({
        monitorId,
        data: {
          message: newMessage,
        },
      });
    },
    async removeWebhookNotifications(webhookName) {
      // Users could have manually added this webhook in other monitors, or
      // removed the webhook from the monitors specified as user props. Hence,
      // we need to search through all the monitors that notify this webhook and
      // remove the notification.
      const webhookTagPattern = new RegExp(
        `\n?${this._webhookTagPattern(webhookName)}`,
      );
      const monitorSearchResults = this._searchMonitors({
        query: {
          query: webhookName,
        },
      });
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
    daysAgo(days) {
      return new Date().setDate(new Date().getDate() - days);
    },
    async listMonitors(args) {
      return this._makeRequest({
        path: "/v1/monitor",
        ...args,
      });
    },
    async listHosts(args) {
      return this._makeRequest({
        path: "/v1/hosts",
        ...args,
      });
    },
    async listTags(args) {
      return this._makeRequest({
        path: "/v1/tags/hosts",
        ...args,
      });
    },
    async listActiveMetrics(args) {
      return this._makeRequest({
        path: "/v1/metrics",
        ...args,
      });
    },
    async postMetricData(args) {
      return this._makeRequest({
        path: "/v2/series",
        method: "post",
        ...args,
      });
    },
    async getEvents(args) {
      return this._makeRequest({
        path: "/v1/events",
        method: "get",
        ...args,
      });
    },
  },
};
