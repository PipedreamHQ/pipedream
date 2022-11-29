import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "miro_custom_app",
  propDefinitions: {
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of a board",
      async options({ prevContext }) {
        const {
          data,
          offset,
        } =
          await this.listBoards({
            limit: 20,
            offset: prevContext.offset,
          });
        const options = data.map((board) => ({
          label: board.name,
          value: board.id,
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.access_token}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path = "", headers = {}, ...args
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
      boardId = "", ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/boards/${boardId}/shapes`,
        ...args,
      });
    },
    createStickyNote({
      boardId = "", ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/boards/${boardId}/sticky_notes`,
        ...args,
      });
    },
    deleteBoard({
      boardId = "", ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    deleteItem({
      boardId = "", itemId = "", ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/boards/${boardId}/items/${itemId}`,
        ...args,
      });
    },
    getBoard({
      boardId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "get",
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    getItems({
      boardId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "get",
        path: `/boards/${boardId}/items`,
        ...args,
      });
    },
    getSpecificItem({
      boardId = "", itemId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "get",
        path: `/boards/${boardId}/items/${itemId}`,
        ...args,
      });
    },
    listBoards({
      boardId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "get",
        path: `/boards`,
        ...args,
      });
    },
    updateBoard({
      boardId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/boards/${boardId}`,
        ...args,
      });
    },
    updateShape({
      boardId = "", itemId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/boards/${boardId}/shapes/${itemId}`,
        ...args,
      });
    },
    updateStickyNote({
      boardId = "", itemId = "", ...args 
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/boards/${boardId}/sticky_notes/${itemId}`,
        ...args,
      });
    }
  },
};
