import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codescene",
  propDefinitions: {
    developerConfiguration: {
      type: "integer",
      label: "Developer Configuration",
      description: "The ID of the developer configuration from the developer settings list.",
      async options() {
        const response = await this.listDeveloperConfigurations();
        return response.map((config) => ({
          label: config.name,
          value: config.id,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project.",
      async options() {
        const response = await this.listProjects();
        return response.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    analysisId: {
      type: "integer",
      label: "Analysis ID",
      description: "The ID of the analysis.",
      async options({ projectId }) {
        const response = await this.listAnalyses({
          projectId,
        });
        return response.map((analysis) => ({
          label: `Analysis ${analysis.id}`,
          value: analysis.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.codescene.io/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listDeveloperConfigurations() {
      return this._makeRequest({
        path: "/developer-configurations",
      });
    },
    async listProjects() {
      return this._makeRequest({
        path: "/projects",
      });
    },
    async listAnalyses({ projectId }) {
      return this._makeRequest({
        path: `/projects/${projectId}/analyses`,
      });
    },
    async getProjectAnalysis({
      projectId, analysisId,
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/analyses/${analysisId}`,
      });
    },
    async createNewProject({ developerConfiguration }) {
      return this._makeRequest({
        method: "POST",
        path: "/projects/new",
        data: {
          "developer-configuration": developerConfiguration,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
