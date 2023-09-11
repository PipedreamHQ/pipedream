import { axios } from "@pipedream/platform";

export default {
  key: "zenkit-add-entry-comment",
  name: "Add Entry Comment",
  description: "Add a comment to an entry/item within a list/collection on Zenkit. [See the docs](https://base.zenkit.com/docs/api/activity/post-api-v1-users-me-lists-listallid-entries-listentryallid-activities)",
  version: "0.0.1",
  type: "action",
  props: {
    zenkit: {
      type: "app",
      app: "zenkit",
    },
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
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment to add to entry",
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
    async addCommentToEntry({
      listId, entryId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `users/me/lists/${listId}/entries/${entryId}/activities`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.addCommentToEntry({
      listId: this.listId,
      entryId: this.entryId,
      data: {
        message: this.comment,
      },
      $,
    });
    $.export("$summary", `Successfully added comment to entry '${response?.listEntryDisplayString}'`);
    return response;
  },
};
