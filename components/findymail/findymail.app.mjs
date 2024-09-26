import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "findymail",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address to verify or find",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the person",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the website",
    },
    companyWebsiteOrName: {
      type: "string",
      label: "Company Website or Name",
      description: "The company's website or name",
    },
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
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    createNewList({ listName }) {
      return this._makeRequest({
        method: "POST",
        path: "/lists",
        data: {
          name: listName,
        },
      });
    },
    deleteList({ listId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/lists/${listId}`,
      });
    },
    getLists() {
      return this._makeRequest({
        path: "/lists",
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/get/0",
        ...opts,
      });
    },
    verifyEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verify",
        ...opts,
      });
    },
    findEmailByNameAndDomain(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/name",
        ...opts,
      });
    },
    findEmailByCompanyDomain(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/domain",
        ...opts,
      });
    },
  },
};
