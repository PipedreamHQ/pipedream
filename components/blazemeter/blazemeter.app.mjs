import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blazemeter",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account",
      async options() {
        const response = await this.listAccounts({});
        const accountIDs = response.result;
        return accountIDs.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of the workspace to retrieve projects from.",
      async options({ accountId }) {
        const { result: resources } = await this.listWorkspaces({
          params: {
            accountId,
          },
        });
        return resources.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "A description for the project.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://a.blazemeter.com/api/v4";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params,
        auth: {
          ...auth,
          username: `${this.$auth.api_key}`,
          password: `${this.$auth.api_secret}`,
        },
      });
    },
    async listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...args,
      });
    },
    async listAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
  },
};
