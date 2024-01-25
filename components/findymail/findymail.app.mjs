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
        const lists = await this.getListOfContactLists();
        return lists.map((list) => ({
          label: list.name,
          value: list.id.toString(),
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
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;

      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...headers,
        },
        data,
        params,
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
    async getListOfContactLists() {
      return this._makeRequest({
        path: "/lists",
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
