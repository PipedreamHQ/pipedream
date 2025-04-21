import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upwave",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Description for workspaceId",
      async options({
        prevContext, page,
      }) {
        const params = prevContext?.next
          ? {
            page: page + 1,
          }
          : {};
        const {
          results, next,
        } = await this.getWorkspaces({
          params,
        });
        return {
          options: results.map(({
            title, id,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            next,
          },
        };
      },
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "Description for boardId",
      async options({
        workspaceId, prevContext, page,
      }) {
        const params = prevContext?.next
          ? {
            page: page + 1,
          }
          : {};
        const {
          results, next,
        } = await this.getBoards({
          workspaceId,
          params,
        });
        return {
          options: results.map(({
            title, id,
          }) => ({
            label: title,
            value: id,
          })),
          context: {
            next,
          },
        };
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
