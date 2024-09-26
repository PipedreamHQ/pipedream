import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rollbar",
  propDefinitions: {
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to create",
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const { result: resources } = await this.listProjects();

        return resources.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
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
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Rollbar-Access-Token": this.$auth.access_token,
        },
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...args,
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
  },
};
