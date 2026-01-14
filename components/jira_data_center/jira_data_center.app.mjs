import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jira_data_center",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board",
      async options() {
        const { values: boards } = await this.listBoards();
        return boards.map((board) => ({
          label: board.name,
          value: board.id,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 25,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/rest`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.personal_access_token}`,
        },
        ...opts,
      });
    },
    getBoard({
      boardId, ...opts
    }) {
      return this._makeRequest({
        path: `/agile/1.0/board/${boardId}`,
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/api/2/project",
        ...opts,
      });
    },
    listBoards(opts = {}) {
      return this._makeRequest({
        path: "/agile/1.0/board",
        ...opts,
      });
    },
  },
};
