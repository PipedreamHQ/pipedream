import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tricentis_qtest",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of a project",
      async options() {
        const projects = await this.listProjects();
        return (projects ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    parentId: {
      type: "string",
      label: "Parent ID",
      description: "The parent module which will contain the newly created requirement",
      async options({ projectId }) {
        const modules = await this.listModules(projectId);
        return (modules ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.qtest_base_uri}/api/v3`;
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createRequirement({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/projects/${projectId}/requirements`,
        ...args,
      });
    },
    listModules(projectId) {
      return this._makeRequest({
        url: `/projects/${projectId}/modules`,
      });
    },
    listProjects() {
      return this._makeRequest({
        url: "/projects",
      });
    },
  },
};
