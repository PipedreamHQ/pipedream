import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailercloud",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to add a new contact to",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the new contact to be added",
    },
    contactAttributes: {
      type: "object",
      label: "Contact Attributes",
      description: "Additional attributes for the new contact",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to be updated",
    },
    newContactDetails: {
      type: "object",
      label: "New Contact Details",
      description: "The new details for the contact to be updated",
    },
    newListName: {
      type: "string",
      label: "New List Name",
      description: "The name of the new list to be created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://cloudapi.mailercloud.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async addContactToList(listId, contactDetails, contactAttributes) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/contacts`,
        data: {
          contact: contactDetails,
          attributes: contactAttributes,
        },
      });
    },
    async updateContact(contactId, newContactDetails, contactAttributes) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data: {
          contact: newContactDetails,
          attributes: contactAttributes,
        },
      });
    },
    async createNewList(newListName) {
      return this._makeRequest({
        method: "POST",
        path: "/lists",
        data: {
          name: newListName,
        },
      });
    },
  },
};
