import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "campayn",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List",
      description: "Identifier of a list",
      async options() {
        const lists = await this.listLists();
        return lists?.map(({
          id, list_name: name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ listId }) {
        const contacts = await this.listContacts(listId);
        return contacts?.map(({
          id, email,
        }) => ({
          label: email,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://campayn.com/api/v1";
    },
    _headers() {
      return {
        Authorization: `TRUEREST apikey=${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    getContact(contactId, args = {}) {
      return this._makeRequest({
        path: `/contacts/${contactId}.json`,
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists.json",
        ...args,
      });
    },
    listContacts(listId, args = {}) {
      return this._makeRequest({
        path: `/lists/${listId}/contacts.json`,
        ...args,
      });
    },
    listEmails(listId, args = {}) {
      return this._makeRequest({
        path: "/emails.json",
        ...args,
      });
    },
    createContact(listId, args = {}) {
      return this._makeRequest({
        path: `/lists/${listId}/contacts.json`,
        method: "POST",
        ...args,
      });
    },
    unsubscribeContact(listId, args = {}) {
      return this._makeRequest({
        path: `/lists/${listId}/unsubscribe.json`,
        method: "POST",
        ...args,
      });
    },
  },
};
