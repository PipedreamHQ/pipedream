import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "klaxoon",
  propDefinitions: {
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID f the board",
      async options({ page }) {
        const { items: boards } = await this.getBoards({
          params: {
            page: page + 1,
          },
        });

        return boards.map((board) => ({
          value: board.id,
          label: board.title,
        }));
      },
    },
    ideaId: {
      type: "string",
      label: "Idea ID",
      description: "The ID of the idea",
      async options({
        boardId, page,
      }) {
        const { items: ideas } = await this.getIdeas({
          boardId,
          params: {
            page: page + 1,
          },
        });

        return ideas.map((idea) => ({
          value: idea.id,
          label: idea.data.content,
        }));
      },
    },
  },
  methods: {
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.klaxoon.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
        ...args,
      });
    },
    async getBoards(args = {}) {
      return this._makeRequest({
        path: "/boards",
        ...args,
      });
    },
    async getIdeas({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `/boards/${boardId}/ideas`,
        ...args,
      });
    },
    async createBoard(args = {}) {
      return this._makeRequest({
        path: "/boards",
        method: "post",
        ...args,
      });
    },
    async createIdea({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `/boards/${boardId}/ideas`,
        method: "post",
        ...args,
      });
    },
    async updateIdea({
      boardId, ideaId, ...args
    }) {
      return this._makeRequest({
        path: `/boards/${boardId}/ideas/${ideaId}`,
        method: "patch",
        ...args,
      });
    },
  },
};
