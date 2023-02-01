import { google } from "googleapis";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "google_contacts",
  propDefinitions: {
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The contact fields on each person to return",
      options: constants.FIELD_OPTIONS,
      default: constants.FIELD_OPTIONS,
    },
    resourceName: {
      type: "string",
      label: "Resource Name",
      description: "The resource name that identifies the contact",
      async options({ prevContext }) {
        const { nextPageToken: pageToken } = prevContext;
        const params = {
          resourceName: constants.RESOURCE_NAME,
          personFields: "names",
          pageToken,
        };
        const client = await this.getClient();
        const {
          connections,
          nextPageToken,
        } = await this.listContacts(client, params);
        if (!connections) {
          return [];
        }
        const options = connections.map((contact) => ({
          label: contact?.names
            ? contact?.names[0].displayName
            : contact.resourceName,
          value: contact.resourceName,
        }));
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    updatePersonFields: {
      type: "string[]",
      label: "Update Fields",
      description: "Contact sections to update",
      options: constants.UPDATE_PERSON_FIELD_OPTIONS,
    },
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Contact's street address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Contact's city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Contact's state",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "Contact's zip code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Contact's country",
      optional: true,
    },
  },
  methods: {
    getClient() {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return google.people({
        version: "v1",
        auth,
      });
    },
    async listContacts(client, params) {
      const { data } = await client.people.connections.list(params);
      return data;
    },
    async getContact(client, params) {
      const { data } = await client.people.get(params);
      return data;
    },
    async updateContact(client, params) {
      const { data } = await client.people.updateContact(params);
      return data;
    },
    async deleteContact(client, params) {
      const { data } = await client.people.deleteContact(params);
      return data;
    },
    async createContact(client, params) {
      const { data } = await client.people.createContact(params);
      return data;
    },
  },
};
