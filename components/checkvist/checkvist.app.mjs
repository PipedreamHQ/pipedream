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
        const lists = await this.getLists();
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "Block of text containing items to add. Indentations indicate nested list items.",
    },
    name: {
      type: "string",
      label: "List Name",
      description: "Name of the new list to be created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.checkvist.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getLists(opts = {}) {
      return this._makeRequest({
        path: "/checklists.json",
        ...opts,
      });
    },
    async createList({
      name, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/checklists.json",
        data: {
          checklist: {
            name,
          },
        },
        ...opts,
      });
    },
    async createListItem({
      listId, content, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/checklists/${listId}/tasks.json`,
        data: {
          task: {
            content,
          },
        },
        ...opts,
      });
    },
    async createMultipleListItems({
      content, listId = "default", ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/checklists/${listId}/import.json`,
        data: {
          import_content: content,
          separate_with_empty_line: false,
        },
        ...opts,
      });
    },
    async watchNewLists() {
      const lists = await this.getLists();
      return lists; // Emit new event when lists change
    },
    async watchNewListItems({ listId }) {
      const items = await this._makeRequest({
        path: `/checklists/${listId}/tasks.json`,
      });
      return items; // Emit new event when list items change
    },
  },
};
