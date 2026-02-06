import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_365_people",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ folderId }) {
        const { value } = folderId
          ? await this.listContactsInFolder({
            folderId,
          })
          : await this.listContacts();
        return value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    folderId: {
      type: "string",
      label: "Folder",
      description: "Identifier of a folder",
      optional: true,
      async options() {
        const { value } = await this.listFolders();
        return value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "Mobile phone number of the contact",
      optional: true,
    },
    homePhones: {
      type: "string[]",
      label: "Home Phones",
      description: "The contact's home phone numbers.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street Address",
      description: "Street address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the contact",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the contact",
      optional: true,
    },
    countryOrRegion: {
      type: "string",
      label: "Country or Region",
      description: "Country or Region of the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          headers: this._headers(),
          ...args,
        });
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    async createHook(args = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...args,
      });
      return response;
    },
    async renewHook({
      hookId, ...args
    }) {
      return await this._makeRequest({
        method: "PATCH",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async deleteHook({
      hookId, ...args
    }) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/me/contacts/${contactId}`,
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/me/contacts",
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/me/contactFolders",
        ...args,
      });
    },
    listContactsInFolder({
      folderId, ...args
    }) {
      return this._makeRequest({
        path: `/me/contactfolders/${folderId}/contacts`,
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/me/contacts",
        method: "POST",
        ...args,
      });
    },
    createContactInFolder({
      folderId, ...args
    }) {
      return this._makeRequest({
        path: `/me/contactFolders/${folderId}/contacts`,
        method: "POST",
        ...args,
      });
    },
    createFolder(args = {}) {
      return this._makeRequest({
        path: "/me/contactFolders",
        method: "POST",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/me/contacts/${contactId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateContactInFolder({
      folderId, contactId, ...args
    }) {
      return this._makeRequest({
        path: `/me/contactFolders/${folderId}/contacts/${contactId}`,
        method: "PATCH",
        ...args,
      });
    },
  },
};
