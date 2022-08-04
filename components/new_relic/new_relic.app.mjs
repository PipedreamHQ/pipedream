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
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
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
    async newDeployment(appId, data) {
      const res = await axios(this, this._getAxiosParams({
        method: "POST",
        path: `/applications/${appId}/deployments.json`,
        data: {
          deployment: data,
        },
      }));
      return res.deployment;
    },
  },
};
