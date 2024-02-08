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
        const { developer_settings: resources } = await this.listDeveloperConfigurations();
        return resources.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The ID of the project.",
      async options() {
        const { projects } = await this.listProjects();

        return projects.map((project) => ({
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
        const { analyses } = await this.listAnalyses({
          projectId,
        });
        return analyses.map((analysis) => ({
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
        $ = this, path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listDeveloperConfigurations() {
      return this._makeRequest({
        path: "/developer-settings",
      });
    },
    async listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async listAnalyses({ projectId }) {
      return this._makeRequest({
        path: `/projects/${projectId}/analyses`,
      });
    },
    async getProjectAnalysis({
      projectId, analysisId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/analyses/${analysisId}`,
        ...args,
      });
    },
    async createNewProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects/new",
        ...args,
      });
    },
  },
};
