import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "infinity",
  propDefinitions: {
    boardId: {
      type: "string",
      label: "Board Id",
      description: "The Id of the board.",
      async options({
        prevContext, workspaceId,
      }) {
        const {
          data, after,
        } = await this.listBoards({
          params: {
            after: prevContext?.after,
            limit: 100,
          },
          workspaceId,
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after,
          },
        };
      },
    },
    folderId: {
      type: "string",
      label: "Folder Id",
      description: "The Id of the folder.",
      async options({
        prevContext, workspaceId, boardId,
      }) {
        const {
          data, after,
        } = await this.listFolders({
          params: {
            after: prevContext?.after,
            limit: 100,
          },
          workspaceId,
          boardId,
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after,
          },
        };
      },
    },
    itemId: {
      type: "string",
      label: "Item Id",
      description: "The Id of the item.",
      async options({
        prevContext, workspaceId, boardId,
      }) {
        const {
          data, after,
        } = await this.listItems({
          params: {
            after: prevContext?.after,
            limit: 100,
            expand: [
              "values.attribute",
            ],
          },
          workspaceId,
          boardId,
        });

        return {
          options: data.map(({
            id: value, values,
          }) => {
            const label = values.filter((item) => item?.attribute?.name === "Name")[0]?.data;
            return {
              label: label || value,
              value,
            };
          }),
          context: {
            after,
          },
        };
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace Id",
      description: "The Id of the workspace.",
      async options({ prevContext }) {
        const {
          data, after,
        } = await this.listWorkspaces({
          params: {
            after: prevContext?.after,
            limit: 100,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            after,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.startinfinity.com/api/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createHook({
      workspaceId, boardId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `workspaces/${workspaceId}/boards/${boardId}/hooks`,
        ...args,
      });
    },
    createItem({
      workspaceId, boardId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards/${boardId}/items`,
        method: "POST",
        ...args,
      });
    },
    deleteHook({
      workspaceId, boardId, hookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `workspaces/${workspaceId}/boards/${boardId}/hooks/${hookId}`,
      });
    },
    deleteItem({
      workspaceId, boardId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards/${boardId}/items/${itemId}`,
        method: "DELETE",
        ...args,
      });
    },
    listAttributes({
      workspaceId, boardId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards/${boardId}/attributes`,
        ...args,
      });
    },
    listBoards({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards`,
        ...args,
      });
    },
    listFolders({
      workspaceId, boardId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards/${boardId}/folders`,
        ...args,
      });
    },
    listItems({
      workspaceId, boardId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards/${boardId}/items`,
        ...args,
      });
    },
    listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "workspaces",
        ...args,
      });
    },
    updateItem({
      workspaceId, boardId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/boards/${boardId}/items/${itemId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
