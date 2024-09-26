import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "parsehub",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The unique identifier of the project",
      async options() {
        const response = await this.listProjects({});
        const projectsIDs = response.projects;
        return projectsIDs.map(({
          token, title,
        }) => ({
          value: token,
          label: title,
        }));
      },
    },
    runToken: {
      type: "string",
      label: "Run Token",
      description: "The token of the run to retrieve data for",
    },
    startUrl: {
      type: "string",
      label: "Start URL",
      description: "The url to start running on",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.parsehub.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_key: `${this.$auth.api_key}`,
        },
      });
    },
    getProjectDetails({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}`,
        ...args,
      });
    },
    async runProject({
      projectId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/run`,
        ...args,
      });
    },
    async getRunData({
      runToken, ...args
    }) {
      return this._makeRequest({
        path: `/runs/${runToken}/data`,
        ...args,
      });
    },
    async listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
  },
};
