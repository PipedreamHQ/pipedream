import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postman",
  propDefinitions: {
    environmentId: {
      type: "string",
      label: "Environment ID",
      description: "The ID of the environment to be used.",
      async options({ workspaceId }) {
        const { environments } = await this.listEnvironments({
          params: {
            workspace: workspaceId,
          },
        });
        return environments.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The ID of the monitor to run.",
      async options() {
        const { monitors } = await this.listMonitors();
        return monitors.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    variable: {
      type: "string",
      label: "Variable",
      description: "The varriable to be updated.",
      async options({ environmentId }) {
        const { environment: { values: variables } } = await this.getEnvironment({
          environmentId,
        });

        return variables.map(({ key }) => key);
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace to be used.",
      async options() {
        const { workspaces } = await this.listWorkspaces();
        return workspaces.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getpostman.com";
    },
    _headers() {
      return {
        "X-Api-Key": `${this.$auth.api_key}`,
        "Accept": "application/vnd.api.v10+json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getEnvironment({
      environmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/environments/${environmentId}`,
        ...opts,
      });
    },
    getMonitor({ monitorId }) {
      return this._makeRequest({
        path: `/monitors/${monitorId}`,
      });
    },
    listEnvironments() {
      return this._makeRequest({
        path: "/environments",
      });
    },
    listMonitors() {
      return this._makeRequest({
        path: "/monitors",
      });
    },
    listWorkspaces() {
      return this._makeRequest({
        path: "/workspaces",
      });
    },
    createEnvironment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/environments",
        ...opts,
      });
    },
    updateEnvironment({
      environmentId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/environments/${environmentId}`,
        ...opts,
      });
    },
    runMonitor({
      monitorId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/monitors/${monitorId}/run`,
        ...opts,
      });
    },
  },
};
