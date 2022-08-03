import mondaySdk from "monday-sdk-js";
import uniqBy from "lodash.uniqby";
import map from "lodash.map";
import flatMap from "lodash.flatmap";
import constants from "./common/constants.mjs";
import mutations from "./common/mutations.mjs";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "monday",
  propDefinitions: {
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The board's unique identifier",
      async options({ page }) {
        return this.listBoardsOptions({
          page: page + 1,
        });
      },
    },
    boardName: {
      type: "string",
      label: "Board Name",
      description: "The board's name",
    },
    boardKind: {
      type: "string",
      label: "Board Kind",
      description: "The board's kind (`public` / `private` / `share`)",
      options: constants.BOARD_KIND_OPTIONS,
    },
    folderId: {
      type: "integer",
      label: "Folder ID",
      description: "Board folder ID",
      optional: true,
    },
    workspaceId: {
      type: "integer",
      label: "Workspace ID",
      description: "Board workspace ID. If you don't specify this field, the board will be created in the **Main Workspace**",
      optional: true,
      async options() {
        return this.listWorkspacesOptions();
      },
    },
    templateId: {
      type: "integer",
      label: "Board Template ID",
      description: "Board ID saved as a custom template. The ID can be obteined from the url in browser selecting the corresponding board (e.g. `https://{subdomain}.monday.com/boards/2419687965`) where `2419687965` is the ID of the template",
      optional: true,
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description: "The name of the new group",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The group's unique identifier",
      optional: true,
      async options({ boardId }) {
        return this.listGroupsOptions({
          boardId,
        });
      },
    },
    itemName: {
      type: "string",
      label: "Item Name",
      description: "The item's name",
    },
    itemColumnValues: {
      type: "object",
      label: "Item Column Values",
      description: "The column values of the new item",
      optional: true,
    },
    itemCreateLabels: {
      type: "boolean",
      label: "Item Create Labels",
      description: "Create Status/Dropdown labels if they're missing. (Requires permission to change board structure)",
      optional: true,
    },
    updateBody: {
      type: "string",
      label: "Update Body",
      description: "The update text",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The item's unique identifier",
      optional: true,
      async options({ boardId }) {
        return this.listItemsOptions({
          boardId,
        });
      },
    },
    updateId: {
      type: "string",
      label: "Update ID",
      description: "The update's unique identifier",
      optional: true,
      async options({
        page, boardId,
      }) {
        return this.listUpdatesOptions({
          boardId,
          page: page + 1,
        });
      },
    },
  },
  methods: {
    async makeRequest({
      query, options,
    }) {
      const monday = mondaySdk();
      monday.setToken(this.$auth.api_key);
      return monday.api(query, options);
    },
    async createBoard(variables) {
      return this.makeRequest({
        query: mutations.createBoard,
        options: {
          variables,
        },
      });
    },
    async createGroup(variables) {
      return this.makeRequest({
        query: mutations.createGroup,
        options: {
          variables,
        },
      });
    },
    async createItem(variables) {
      return this.makeRequest({
        query: mutations.createItem,
        options: {
          variables,
        },
      });
    },
    async createUpdate(variables) {
      return this.makeRequest({
        query: mutations.createUpdate,
        options: {
          variables,
        },
      });
    },
    async updateItemName(variables) {
      return this.makeRequest({
        query: mutations.updateItemName,
        options: {
          variables,
        },
      });
    },
    async listBoards(variables) {
      return this.makeRequest({
        query: queries.listBoards,
        options: {
          variables,
        },
      });
    },
    async listItemsBoard(variables) {
      return this.makeRequest({
        query: queries.listItemsBoard,
        options: {
          variables,
        },
      });
    },
    async listUpdatesBoard(variables) {
      return this.makeRequest({
        query: queries.listUpdatesBoard,
        options: {
          variables,
        },
      });
    },
    async listWorkspacesBoards() {
      return this.makeRequest({
        query: queries.listWorkspacesBoards,
      });
    },
    async listGroupsBoards(variables) {
      return this.makeRequest({
        query: queries.listGroupsBoards,
        options: {
          variables,
        },
      });
    },
    async listBoardsOptions(variables) {
      const {
        data,
        errors,
        error_message: errorMessage,
      } = await this.listBoards(variables);

      if (errors) {
        throw new Error(`Error fetching boards: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failure fetching boards: ${errorMessage}`);
      }

      const { boards } = data;
      return boards
        .map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
    },
    async listWorkspacesOptions() {
      const {
        data,
        errors,
        error_message: errorMessage,
      } = await this.listWorkspacesBoards();

      if (errors) {
        throw new Error(`Error listing workspaces: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failed to list workspaces: ${errorMessage}`);
      }

      const { boards } = data;
      const options =
        boards
          .filter(({ workspace }) => workspace)
          .map(({ workspace }) => ({
            label: workspace.name,
            value: workspace.id,
          }));
      return uniqBy(options, "value");
    },
    async listGroupsOptions(variables) {
      const {
        errors,
        data,
        error_message: errorMessage,
      } = await this.listGroupsBoards(variables);

      if (errors) {
        throw new Error(`Failed to list groups: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failed to list groups: ${errorMessage}`);
      }

      const { boards } = data;
      const options =
        flatMap(boards, ({ groups }) =>
          map(groups, ({
            id, title,
          }) =>
            ({
              value: id,
              label: title,
            })));
      return options;
    },
    async listItemsOptions(variables) {
      const {
        errors,
        data,
        error_message: errorMessage,
      } = await this.listItemsBoard(variables);

      if (errors) {
        throw new Error(`Failed to list items: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failed to list items: ${errorMessage}`);
      }

      const { boards } = data;
      const options =
        flatMap(boards, ({ items }) =>
          map(items, ({
            id, name,
          }) =>
            ({
              value: id,
              label: name,
            })));
      return options;
    },
    async listUpdatesOptions(variables) {
      const {
        errors,
        data,
        error_message: errorMessage,
      } = await this.listUpdatesBoard(variables);

      if (errors) {
        throw new Error(`Failed to list updates: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failed to list updates: ${errorMessage}`);
      }

      const { boards } = data;
      const options =
        flatMap(boards, ({ updates }) =>
          map(updates, ({
            id, body,
          }) =>
            ({
              value: id,
              label: body,
            })));
      return options;
    },
  },
};
