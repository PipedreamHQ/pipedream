import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upwave",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Description for workspaceId",
      async options() {
        const response = await this.getWorkspaces();
        const workspaces = response.results;
        return workspaces.map(({
          title, id,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "Description for boardId",
      async options({ workspaceId }) {
        const response = await this.getBoards({
          workspaceId,
        });
        const boards = response.results;
        return boards.map(({
          title, id,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
    dueDt: {
      type: "string",
      label: "Due Date",
      description: "The due date of the card, i.e.: `2025-12-31`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the card",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.upwave.io";
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
          "Authorization": `Token ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createCard({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/cards/`,
        method: "post",
        ...args,
      });
    },
    async getWorkspaces(args = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    async getBoards({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/boards`,
        ...args,
      });
    },
  },
};
