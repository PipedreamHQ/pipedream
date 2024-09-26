import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "new_relic",
  propDefinitions: {
    application: {
      type: "integer",
      label: "Application ID",
      description: "The ID of the application to create the deployment for",
      async options({ page }) {
        const apps = await this.listApps(page + 1);
        return apps.map((app) => ({
          label: app.name,
          value: app.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.newrelic.com/v2";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Api-Key": this.$auth.api_key,
      };
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listApps(page) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: "/applications.json",
        params: {
          page,
        },
      }));
      return res.applications;
    },
    async newDeployment(appId, data, $ = this) {
      const res = await axios($, this._getAxiosParams({
        method: "POST",
        path: `/applications/${appId}/deployments.json`,
        data: {
          deployment: data,
        },
      }));
      return res.deployment;
    },
    async listDeployments(appId) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: `/applications/${appId}/deployments.json`,
      }));
      return res.deployments;
    },
    async listAlerts(query) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: "/alerts_events.json",
        params: query,
      }));
      return res.recent_events;
    },
  },
};
