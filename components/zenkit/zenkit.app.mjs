import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zenkit",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "Filter by workspace",
      async options() {
        const workspaces = await this.listWorkspaces();
        if (!workspaces || workspaces?.length === 0) {
          return [];
        }
        return workspaces.map((workspace) => ({
          value: workspace.id,
          label: workspace.name,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List",
      description: "Filter by list",
      async options({ workspaceId }) {
        const lists = await this.listLists({
          workspaceId,
        });
        if (!lists || lists?.length === 0) {
          return [];
        }
        return lists.map((list) => ({
          value: list.shortId,
          label: list.name,
        }));
      },
    },
    entryId: {
      type: "string",
      label: "Entry",
      description: "Filter by entry",
      async options({
        listId, page,
      }) {
        const limit = 10;
        const entries = await this.listListEntries({
          listId,
          data: {
            limit,
            skip: limit * page,
          },
        });
        if (!entries || entries?.length === 0) {
          return [];
        }
        return entries.map((entry) => ({
          value: entry.id,
          label: entry.displayString,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "Filter by user",
      async options({ workspaceId }) {
        const users = await this.listWorkspaceUsers({
          workspaceId,
        });
        if (!users || users?.length === 0) {
          return [];
        }
        return users.map((user) => ({
          value: user.id,
          label: user.fullname,
        }));
      },
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The sort order of the list entry",
      options: [
        "highest",
        "lowest",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://zenkit.com/api/v1/";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        ...args,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${id}`,
      });
    },
    async getEntry({
      listId, entryId, ...args
    }) {
      return this._makeRequest({
        path: `lists/${listId}/entries/${entryId}`,
        ...args,
      });
    },
    async getList({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `lists/${listId}`,
        ...args,
      });
    },
    async getListElements({
      listId, ...args
    }) {
      return await this._makeRequest({
        path: `lists/${listId}/elements`,
        ...args,
      });
    },
    async listWorkspaces(args = {}) {
      return this._makeRequest({
        path: "users/me/workspacesWithLists",
        ...args,
      });
    },
    async listLists({
      workspaceId, ...args
    }) {
      const workspaces = await this.listWorkspaces({
        ...args,
      });
      const workspace = workspaces.find((workspace) => workspace.id == workspaceId);
      return workspace?.lists;
    },
    async listWorkspaceActivities({
      workspaceId, ...args
    }) {
      const { activities } = await this._makeRequest({
        path: `workspaces/${workspaceId}/activities`,
        ...args,
      });
      return activities;
    },
    async listListActivities({
      listId, ...args
    }) {
      const { activities } = await this._makeRequest({
        path: `lists/${listId}/activities`,
        ...args,
      });
      return activities;
    },
    async listNotifications(args = {}) {
      const { notifications } = await this._makeRequest({
        path: "users/me/notifications",
        ...args,
      });
      return notifications;
    },
    async listListEntries({
      listId, ...args
    }) {
      const { listEntries } = await this._makeRequest({
        method: "POST",
        path: `lists/${listId}/entries/filter/list`,
        ...args,
      });
      return listEntries;
    },
    async listWorkspaceUsers({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `workspaces/${workspaceId}/users`,
        ...args,
      });
    },
    async addCommentToEntry({
      listId, entryId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `users/me/lists/${listId}/entries/${entryId}/activities`,
        ...args,
      });
    },
    async createEntry({
      listId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `lists/${listId}/entries`,
        ...args,
      });
    },
    async updateEntry({
      listId, entryId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `lists/${listId}/entries/${entryId}`,
        ...args,
      });
    },
  },
};
