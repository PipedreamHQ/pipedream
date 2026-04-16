import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

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
    client() {
      return Client.init({
        authProvider: (done) => {
          done(null, this.$auth.oauth_access_token);
        },
      });
    },
    async createHook({ data = {} } = {}) {
      return await this.client().api("/subscriptions")
        .post(data);
    },
    async renewHook({
      hookId, data = {},
    }) {
      return await this.client().api(`/subscriptions/${hookId}`)
        .patch(data);
    },
    async deleteHook({ hookId }) {
      return await this.client().api(`/subscriptions/${hookId}`)
        .delete();
    },
    async getContact({
      contactId, params = {},
    }) {
      return await this.client().api(`/me/contacts/${contactId}`)
        .get(params);
    },
    async listContacts(params = {}) {
      return await this.client().api("/me/contacts")
        .get(params);
    },
    async listFolders(params = {}) {
      return await this.client().api("/me/contactFolders")
        .get(params);
    },
    async listContactsInFolder({
      folderId, params = {},
    }) {
      return await this.client().api(`/me/contactfolders/${folderId}/contacts`)
        .get(params);
    },
    async createContact({ data = {} } = {}) {
      return await this.client().api("/me/contacts")
        .post(data);
    },
    async createContactInFolder({
      folderId, data = {},
    }) {
      return await this.client().api(`/me/contactFolders/${folderId}/contacts`)
        .post(data);
    },
    async createFolder({ data = {} } = {}) {
      return await this.client().api("/me/contactFolders")
        .post(data);
    },
    async updateContact({
      contactId, data = {},
    }) {
      return await this.client().api(`/me/contacts/${contactId}`)
        .patch(data);
    },
    async updateContactInFolder({
      folderId, contactId, data = {},
    }) {
      return await this.client().api(`/me/contactFolders/${folderId}/contacts/${contactId}`)
        .patch(data);
    },
  },
};
