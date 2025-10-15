import flatMap from "lodash.flatmap";
import map from "lodash.map";
import uniqBy from "lodash.uniqby";
import mondaySdk from "monday-sdk-js";
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
      description: "Select a board, or provide a board ID",
      async options({ page }) {
        return this.listBoardsOptions({
          page: page + 1,
        });
      },
    },
    boardName: {
      type: "string",
      label: "Board Name",
      description: "The new board's name",
    },
    boardKind: {
      type: "string",
      label: "Board Kind",
      description: "The new board's kind (`public` / `private` / `share`)",
      options: constants.BOARD_KIND_OPTIONS,
    },
    folderId: {
      type: "integer",
      label: "Folder ID",
      description: "Optionally select a folder to create the board in, or provide a folder ID",
      optional: true,
      async options({ workspaceId }) {
        return this.listFolderOptions({
          workspaceId,
        });
      },
    },
    workspaceId: {
      type: "integer",
      label: "Workspace ID",
      description: "Select a workspace to create the board in, or provide a workspace ID. If not specified, the **Main Workspace** will be used",
      optional: true,
      async options() {
        return this.listWorkspacesOptions();
      },
    },
    templateId: {
      type: "integer",
      label: "Board Template ID",
      description: "The board's template ID. You can obtain it from the URL when selecting the desired board (e.g. `https://{subdomain}.monday.com/boards/2419687965`) where `2419687965` is the template ID. [See the documentation](https://developer.monday.com/api-reference/reference/boards#create-a-board) for more information",
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
      description: "Select a group or provide a group ID",
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
      description: "The new item's name",
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
      description: "Select an item or provide an item ID",
      optional: true,
      async options({
        boardId, prevContext,
      }) {
        return this.listItemsOptions({
          boardId,
          cursor: prevContext.cursor,
        });
      },
    },
    updateId: {
      type: "string",
      label: "Update ID",
      description: "Select an update or provide an update ID",
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
    column: {
      type: "string",
      label: "Column",
      description: "Select a column to watch for changes",
      async options({ boardId }) {
        const columns = await this.listColumnOptions({
          boardId: +boardId,
        });
        return columns
          ?.filter((column) => column.id !== "name")
          .map((column) => ({
            label: column.title,
            value: column.id,
          })) ?? [];
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
    async createWebhook(variables) {
      return this.makeRequest({
        query: mutations.createWebhook,
        options: {
          variables,
        },
      });
    },
    async deleteWebhook(variables) {
      return this.makeRequest({
        query: mutations.deleteWebhook,
        options: {
          variables,
        },
      });
    },
    async getItem(variables) {
      const { data } = await this.makeRequest({
        query: queries.getItem,
        options: {
          variables,
        },
      });
      return data?.items[0];
    },
    async getBoard(variables) {
      const { data } = await this.makeRequest({
        query: queries.getBoard,
        options: {
          variables,
        },
      });
      return data?.boards[0];
    },
    async getUser(variables) {
      const { data } = await this.makeRequest({
        query: queries.getUser,
        options: {
          variables,
        },
      });
      return data?.users[0];
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
    async createColumn(variables) {
      return this.makeRequest({
        query: mutations.createColumn,
        options: {
          variables,
        },
      });
    },
    async createSubItem(variables) {
      return this.makeRequest({
        query: mutations.createSubItem,
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
    async listItemsBoard({
      cursor, ...variables
    }) {
      const query = cursor
        ? queries.listItemsNextPage
        : queries.listItemsBoard;
      const options = cursor
        ? {
          variables: cursor,
        }
        : {
          variables,
        };
      return this.makeRequest({
        query,
        options,
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
    async listWorkspaces() {
      return this.makeRequest({
        query: queries.listWorkspaces,
      });
    },
    async listFolders(variables) {
      return this.makeRequest({
        query: queries.listFolders,
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
    async listColumnOptions(variables) {
      const { data } = await this.makeRequest({
        query: queries.listColumnOptions,
        options: {
          variables,
        },
      });
      return data?.boards[0]?.columns;
    },
    async listColumns(variables) {
      const { data } = await this.makeRequest({
        query: queries.listColumns,
        options: {
          variables,
        },
      });
      return data?.boards[0]?.columns;
    },
    listBoardItemsPage(variables) {
      return this.makeRequest({
        query: queries.listBoardItemsPage,
        options: {
          variables,
        },
      });
    },
    async listUsers(variables) {
      const { data } = await this.makeRequest({
        query: queries.listUsers,
        options: {
          variables,
        },
      });
      return data?.users;
    },
    async getColumnValues(variables) {
      return this.makeRequest({
        query: queries.getColumnValues,
        options: {
          variables,
        },
      });
    },
    async getItemsByColumnValue({
      cursor, ...variables
    }) {
      const query = cursor
        ? queries.listItemsNextPage
        : queries.getItemsByColumnValue;
      const options = cursor
        ? {
          variables: cursor,
        }
        : {
          variables,
        };
      return this.makeRequest({
        query,
        options,
      });
    },
    async updateColumnValues(variables) {
      return this.makeRequest({
        query: mutations.updateColumnValues,
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
        ?.filter(({ type }) => type !== constants.BOARD_TYPE.SUB_ITEMS_BOARD)
        .map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) ?? [];
    },
    async listFolderOptions(variables) {
      const {
        data, errors, error_message: errorMessage,
      } = await this.listFolders(variables);

      if (errors) {
        throw new Error(`Error listing folders: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failed to list folders: ${errorMessage}`);
      }

      const { folders } = data;
      return folders
        .map(({
          id, name,
        }) => ({
          label: name,
          value: +id,
        }));
    },
    async listWorkspacesOptions() {
      const {
        data,
        errors,
        error_message: errorMessage,
      } = await this.listWorkspaces();

      if (errors) {
        throw new Error(`Error listing workspaces: ${errors[0].message}`);
      }

      if (errorMessage) {
        throw new Error(`Failed to list workspaces: ${errorMessage}`);
      }

      const { workspaces } = data;
      const options =
        workspaces
          .map((workspace) => ({
            label: workspace.name,
            value: +workspace.id,
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
      const items = boards[0].items_page.items;
      const cursor = boards[0].items_page.cursor;
      const options = items.map(({
        id, name,
      }) => ({
        value: id,
        label: name,
      }));
      return {
        options,
        context: {
          cursor,
        },
      };
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
