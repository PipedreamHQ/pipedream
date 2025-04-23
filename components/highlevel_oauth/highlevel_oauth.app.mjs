import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "highlevel_oauth",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "If not specified, defaults to the authenticated location.",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Search for a contact or provide a custom contact ID",
      useQuery: true,
      async options({ query }) {
        const { contacts } = await this.searchContacts({
          params: {
            query,
            limit: 100,
            locationId: this.getLocationId(),
          },
        });
        return contacts?.map(({
          id, name, email,
        }) => ({
          label: name ?? email ?? id,
          value: id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign to add contact to",
      async options() {
        const { campaigns } = await this.listCampaigns({
          params: {
            locationId: this.getLocationId(),
          },
        });
        return campaigns?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    noteId: {
      type: "string",
      label: "Note ID",
      description: "The ID of the note to update",
      async options({ contactId }) {
        const { notes } = await this.listNotes({
          contactId,
        });
        return notes?.map(({
          id: value, body,
        }) => ({
          label: body.slice(0, 50),
          value,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of a user",
      async options() {
        const { users } = await this.listNotes({
          params: {
            locationId: this.getLocationId(),
          },
        });
        return users?.map(({
          id, name, email,
        }) => ({
          label: name ?? email ?? id,
          value: id,
        }));
      },
    },
    schemaKey: {
      type: "string",
      label: "Object Schema Key",
      description: "Key used to refer the custom / standard Object internally (lowercase + underscore_separated)",
      async options() {
        const { objects } = await this.listObjects({
          params: {
            locationId: this.getLocationId(),
          },
        });
        return objects?.map(({
          key: value, labels,
        }) => ({
          label: labels.plural,
          value,
        })) || [];
      },
    },
  },
  methods: {
    getLocationId() {
      return this.$auth.locationId;
    },
    _baseUrl() {
      return "https://services.leadconnectorhq.com";
    },
    _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Version": "2021-07-28",
        },
        ...otherOpts,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts/",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
    upsertContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts/upsert",
        ...args,
      });
    },
    searchContacts(args = {}) {
      return this._makeRequest({
        url: "/contacts/",
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        url: "/campaigns/",
        ...args,
      });
    },
    listFormSubmissions(args = {}) {
      return this._makeRequest({
        url: "/forms/submissions",
        ...args,
      });
    },
    listNotes({
      contactId, ...args
    }) {
      return this._makeRequest({
        url: `/contacts/${contactId}/notes`,
        ...args,
      });
    },
    getObject({
      schemaKey, ...args
    }) {
      return this._makeRequest({
        url: `/objects/${schemaKey}`,
        ...args,
      });
    },
    listObjects(args = {}) {
      return this._makeRequest({
        url: "/objects",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
    updateNote({
      contactId, noteId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/contacts/${contactId}/notes/${noteId}`,
        ...args,
      });
    },
    createRecord({
      schemaKey, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/objects/${schemaKey}/records`,
        ...args,
      });
    },
    updateRecord({
      schemaKey, recordId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/objects/${schemaKey}/records/${recordId}`,
        ...args,
      });
    },
    addContactToCampaign({
      contactId, campaignId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/contacts/${contactId}/campaigns/${campaignId}`,
        ...args,
      });
    },
  },
};
