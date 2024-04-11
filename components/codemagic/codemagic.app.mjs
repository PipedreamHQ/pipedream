import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codemagic",
  propDefinitions: {
    appID: {
      type: "string",
      label: "Application ID",
      description: "The ID of the application",
      async options() {
        const { applications } = await this.listApps();

        return applications.map(({
          _id, appName,
        }) => ({
          value: _id,
          label: appName,
        }));
      },
    },
    workflowID: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the workflow",
    },
    repositoryUrl: {
      type: "string",
      label: "Repository URL",
      description: "SSH or HTTPS URL for cloning the repository",
    },
    key: {
      type: "string",
      label: "Variable Key",
      description: "Name of the variable",
    },
    value: {
      type: "string",
      label: "Variable Value",
      description: "Value of the variable",
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "Team ID, if you wish to add an app directly to one of your teams. You must be an admin in the team specified",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.codemagic.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "x-auth-token": `${this.$auth.api_token}`,
        },
      });
    },
    async listApps(args = {}) {
      return this._makeRequest({
        path: "/apps",
        ...args,
      });
    },
    async listVariables({
      app_id, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/apps/${app_id}/variables`,
        ...args,
      });
    },
    async addApp(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/apps",
        ...args,
      });
    },
  },
};
