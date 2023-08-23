import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "talend",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "The workspace to retrieve.",
      async options() {
        const res = await this.listWorkspaces();
        return res.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    environmentId: {
      type: "string",
      label: "Environment",
      description: "The environment to retrieve.",
      async options() {
        const res = await this.listEnvironments();
        return res.map((environment) => ({
          label: environment.name,
          value: environment.id,
        }));
      },
    },
  },
  methods: {
    _getPersonalAccessToken() {
      return this.$auth.personal_access_token;
    },
    _getBaseUrl(endpointLocation) {
      return `https://api.${endpointLocation}.cloud.talend.com`;
    },
    _getEndpointLocation() {
      return this.$auth.endpoint;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getPersonalAccessToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl(this._getEndpointLocation()) + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async listWorkspaces() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/orchestration/workspaces",
      });
    },
    async listEnvironments() {
      return this._makeHttpRequest({
        method: "GET",
        path: "/orchestration/environments",
      });
    },
    async getAvailablePlansExecutions(data, page) {
      const LIMIT = 1;
      return this._makeHttpRequest({
        method: "GET",
        path: "/processing/executables/plans/executions",
        params: {
          ...data,
          offset: (page - 1) * LIMIT,
          limit: LIMIT,
        },
      });
    },
  },
};
