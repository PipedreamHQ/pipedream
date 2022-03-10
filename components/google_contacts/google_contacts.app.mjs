import { google } from "googleapis";
const fieldOptions = [
  "addresses",
  "ageRanges",
  "biographies",
  "birthdays",
  "calendarUrls",
  "clientData",
  "coverPhotos",
  "emailAddresses",
  "events",
  "externalIds",
  "genders",
  "imClients",
  "interests",
  "locales",
  "locations",
  "memberships",
  "metadata",
  "miscKeywords",
  "names",
  "nicknames",
  "occupations",
  "organizations",
  "phoneNumbers",
  "photos",
  "relations",
  "sipAddresses",
  "skills",
  "urls",
  "userDefined",
];

export default {
  type: "app",
  app: "google_contacts",
  propDefinitions: {
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The contact fields on each person to return",
      options: fieldOptions,
      optional: true,
      default: fieldOptions,
    },
    resourceName: {
      type: "string",
      label: "Resource Name",
      description: "The resource name that identifies the contact",
      async options({ prevContext }) {
        const { nextPageToken: pageToken } = prevContext;
        const params = {
          resourceName: "people/me",
          personFields: "names",
          pageToken,
        };
        const client = await this.getClient();
        const {
          connections,
          nextPageToken,
        } = await this.listContacts(client,
          params);
        const options = connections.map((contact) => ({
          label: contact.names
            ? contact.names[0].displayName
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
      options: [
        "names",
        "emailAddresses",
        "phoneNumbers",
        "addresses",
      ],
      reloadProps: true,
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
    async getClient() {
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
  },
};
