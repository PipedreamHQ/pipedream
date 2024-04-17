import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "highlevel_oauth",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "Select a location or provide a custom location ID",
      async options({ page }) {
        const { locations } = await this.searchLocations({
          params: {
            limit: page,
          },
        });
        return locations?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
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
  },
  methods: {
    _baseUrl() {
      return "https://services.leadconnectorhq.com";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async createContact(args) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
    async upsertContact(args) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts/upsert",
        ...args,
      });
    },
    async searchContacts(args) {
      return this._makeRequest({
        url: "/contacts",
        ...args,
      });
    },
    async searchLocations(args) {
      return this._makeRequest({
        url: "/locations/search",
        ...args,
      });
    },
  },
};
