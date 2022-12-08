import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "miro_custom_app",
  propDefinitions: {
    name: {
      type: "string",
      label: "Board Name",
      description: "Name for the board.",
    },
    description: {
      type: "string",
      label: "Board Description",
      description: "Description for the board.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The text you want to display on the shape.",
    },
    shape: {
      type: "string",
      label: "Shape Type",
      description: "Defines the geometric shape of the item when it is rendered on the board.",
      options: constants.ITEM_SHAPES_OPTIONS,
    },
    x: {
      type: "integer",
      label: "X Position",
      description: "X-axis coordinate of the location of the item on the board. By default, all items have absolute positioning to the board, not the current viewport. The center point of the board has `x: 0` and `y: 0` coordinates.",
      default: 0,
    },
    y: {
      type: "integer",
      label: "Y Position",
      description: "Y-axis coordinate of the location of the item on the board. By default, all items have absolute positioning to the board, not the current viewport. The center point of the board has `x: 0` and `y: 0` coordinates.",
      default: 0,
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The `team_id` for which you want to retrieve the list of boards.",
      optional: true,
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of a board",
      async options({
        teamId, prevContext,
      }) {
        const {
          data,
          offset,
        } =
          await this.listBoards({
            params: {
              team_id: teamId,
              limit: constants.DEFAULT_LIMIT,
              offset: prevContext.offset,
            },
          });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            offset,
          },
        };
      },
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of an item (Shape)",
      async options({
        boardId, prevContext,
      }) {
        const {
          data,
          offset,
        } =
          await this.listItems({
            boardId,
            params: {
              limit: constants.DEFAULT_LIMIT,
              offset: prevContext.offset,
            },
          });
        const options = data.map(({
          id: value, type, data,
        }) => ({
          label: data.content || data[type] || type,
          value,
        }));
        return {
          options,
          context: {
            offset,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "accept": "application/json",
        "authorization": `Bearer ${this.$auth.access_token}`,
        "content-type": "application/json",
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    createBoard(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/boards",
        ...args,
      });
    },
    createShape({
      boardId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/boards/${boardId}/shapes`,
        ...args,
      });
    },
    createStickyNote({
      boardId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/boards/${boardId}/sticky_notes`,
        ...args,
      });
    },
    deleteBoard({
      boardId, ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    deleteItem({
      boardId, itemId, ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/boards/${boardId}/items/${itemId}`,
        ...args,
      });
    },
    getBoard({
      boardId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    listItems({
      boardId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/boards/${boardId}/items`,
        ...args,
      });
    },
    getSpecificItem({
      boardId, itemId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/boards/${boardId}/items/${itemId}`,
        ...args,
      });
    },
    listBoards(args = {}) {
      return this.makeRequest({
        path: "/boards",
        ...args,
      });
    },
    updateBoard({
      boardId, ...args
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    updateShape({
      boardId, itemId, ...args
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/boards/${boardId}/shapes/${itemId}`,
        ...args,
      });
    },
    updateStickyNote({
      boardId, itemId, ...args
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/boards/${boardId}/sticky_notes/${itemId}`,
        ...args,
      });
    },
  },
};
