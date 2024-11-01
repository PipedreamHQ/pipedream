import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "checkvist",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Select a list to monitor for new items",
      async options() {
        const lists = await this.getLists({
          params: {
            skip_stats: true,
          },
        });
        return lists.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    parentId: {
      type: "string",
      label: "Parent task ID",
      description: "Empty for root-level tasks",
      async options({ listId }) {
        const items = await this.getListItems({
          listId,
        });
        return items.map(({
          id: value, content: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://checkvist.com";
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    getLists(opts = {}) {
      return this._makeRequest({
        path: "/checklists.json",
        ...opts,
      });
    },
    getListItems({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/checklists/${listId}/tasks.json`,
        ...opts,
      });
    },
    createList(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/checklists.json",
        ...opts,
      });
    },
    createListItem({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/checklists/${listId}/tasks.json`,
        ...opts,
      });
    },
    createMultipleListItems({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/checklists/${listId}/import.json`,
        ...opts,
      });
    },
  },
};
