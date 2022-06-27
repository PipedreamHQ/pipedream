import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pinterest",
  propDefinitions: {
    boardId: {
      type: "string",
      label: "Board ID",
      description: "An ID identifying the board",
      async options({ prevContext }) {
        const pageSize = 25;
        const { bookmark } = prevContext || {};
        const resp = await this.getBoards({
          params: {
            bookmark,
            page_size: pageSize,
          },
        });
        return {
          options: resp.items.map((board) => ({
            label: board.name,
            value: board.id,
          })),
          context: {
            bookmark: resp.bookmark,
          },
        };
      },
    },
    boardSectionId: {
      type: "string",
      label: "Board Section ID",
      description: "An ID identifying the board section",
      optional: true,
      async options({
        boardId,
        prevContext,
      }) {
        const pageSize = 25;
        const { bookmark } = prevContext || {};
        const resp = await this.getBoardSections({
          boardId,
          params: {
            bookmark,
            page_size: pageSize,
          },
        });
        return {
          options: resp.items.map((section) => ({
            label: section.name,
            value: section.id,
          })),
          context: {
            bookmark: resp.bookmark,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the pin",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the pin",
      optional: true,
    },
    link: {
      type: "string",
      label: "Link",
      description: "Source link",
      optional: true,
    },
    altText: {
      type: "string",
      label: "Alt. Text",
      description: "Alt. text of the pin",
      optional: true,
    },
    media: {
      type: "string",
      label: "Media",
      description: "The media content of the pin, only images are supported currently, please provide an image url or an image file from `/tmp`",
    },
  },
  methods: {
    async _getUrl(path) {
      return `https://api.pinterest.com/v5${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: await this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getBoards({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/boards",
        ...args,
      });
    },
    async getBoardSections({
      boardId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/boards/${boardId}/sections`,
        ...args,
      });
    },
    async createPin({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/pins",
        ...args,
      });
    },
    async getPins({
      boardId,
      boardSectionId,
      ...args
    } = {}) {
      const path = boardSectionId ?
        `/boards/${boardId}/sections/${boardSectionId}/pins` :
        `/boards/${boardId}/pins`;
      return await this._makeRequest({
        method: "GET",
        path,
        ...args,
      });
    },
  },
};
