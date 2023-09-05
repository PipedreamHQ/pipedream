import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "roboflow",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options() {
        const projects = await this.listProjects();
        return projects?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset",
      description: "Identifier of a dataset",
      async options({ projectId }) {
        const datasets = await this.listDatasets({
          projectId,
        });
        return datasets?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.roboflow.com";
    },
    _authParams(params) {
      return {
        ...params,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      console.log({
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    async getWorkspaceId() {
      const { workspace } = await this._makeRequest({
        path: "/",
      });
      return workspace;
    },
    async listProjects(args = {}) {
      const workspaceId = await this.getWorkspaceId();
      const { workspace } = await this._makeRequest({
        path: `/${workspaceId}`,
        ...args,
      });
      return workspace?.projects;
    },
    async listDatasets({
      projectId, ...args
    }) {
      const { versions } = await this._makeRequest({
        path: `/${projectId}`,
        ...args,
      });
      return versions;
    },
    uploadImage({
      datasetId, ...args
    }) {
      return this._makeRequest({
        path: `/dataset/${datasetId}/upload`,
        method: "POST",
        ...args,
      });
    },
  },
};
