import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

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
        let datasets = await this.listDatasets({
          projectId,
        });
        return datasets?.filter(({ model }) => model)?.map(({
          id, name: label,
        }) => ({
          value: utils.extractSubstringAfterSlash(id),
          label,
        })) || [];
      },
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`)",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the image file",
      optional: true,
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
      url,
      params = {},
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
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
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/dataset/${projectId}/upload`,
        method: "POST",
        ...args,
      });
    },
    detectObject({
      datasetId, ...args
    }) {
      return this._makeRequest({
        url: `https://detect.roboflow.com/${datasetId}`,
        method: "POST",
        ...args,
      });
    },
    classifyImage({
      datasetId, ...args
    }) {
      return this._makeRequest({
        url: `https://classify.roboflow.com/${datasetId}`,
        method: "POST",
        ...args,
      });
    },
  },
};
