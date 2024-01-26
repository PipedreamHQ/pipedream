import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "findymail",
  propDefinitions: {
    listName: {
      type: "string",
      label: "List Name",
      description: "The name of the list to create or manage",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to manage",
      async options() {
        const { lists } = await this.getLists();

        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.findymail.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async createNewList({ listName }) {
      return this._makeRequest({
        method: "POST",
        path: "/lists",
        data: {
          name: listName,
        },
      });
    },
    async deleteList({ listId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/lists/${listId}`,
      });
    },
    async getLists() {
      return this._makeRequest({
        path: "/lists",
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
