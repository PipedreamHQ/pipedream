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
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person",
    },
    websiteDomain: {
      type: "string",
      label: "Website Domain",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
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
    async getLists() {
      return this._makeRequest({
        path: "/lists",
      });
    },
    async verifyEmail({ email }) {
      return this._makeRequest({
        method: "POST",
        path: "/verify",
        data: {
          email,
        },
      });
    },
    async findEmailByNameAndDomain({
      fullName, websiteDomain,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/search/name",
        data: {
          name: fullName,
          domain: websiteDomain,
        },
      });
    },
    async findEmailByNameAndCompany({
      fullName, companyWebsiteOrName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/search/name",
        data: {
          name: fullName,
          domain: companyWebsiteOrName,
        },
      });
    },
  },
};
