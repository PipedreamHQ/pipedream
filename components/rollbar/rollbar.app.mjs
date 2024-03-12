import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rollbar",
  propDefinitions: {
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to create.",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to delete or list.",
      async options() {
        const { data } = await this.listProjects();
        return data.result.map((project) => ({
          label: project.name,
          value: project.id.toString(),
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rollbar.com/api/1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Rollbar-Access-Token": this.$auth.oauth_access_token,
        },
        data,
        params,
      });
    },
    async createProject({ name }) {
      return this._makeRequest({
        method: "POST",
        path: "/project",
        data: {
          name,
        },
      });
    },
    async listProjects() {
      return this._makeRequest({
        path: "/projects",
      });
    },
    async deleteProject({ projectId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/project/${projectId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
