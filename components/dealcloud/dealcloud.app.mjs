import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dealcloud",
  propDefinitions: {
    entryTypeId: {
      type: "integer",
      label: "Object ID",
      description: "The ID of the object (entry type) to use.",
      async options() {
        const results = await this.listEntryTypes();
        return results.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  entryId: {
    type: "integer",
    label: "Record ID",
    description: "The ID of the record (entry) to use.",
    async options({ entryTypeId }) {
      const results = await this.getAllEntryTypeEntries({
        entryTypeId,
      });
      return results.map((entry) => {
        const value = entry.EntryId || entry.Id || entry.id;
        const label = entry.Name || value;
        return {
          label,
          value,
        };
      });
    },
  },
  methods: {
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: `${this.$auth.host_url}/api/rest/v4/`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async listEntryTypes(args = {}) {
      return this._makeRequest({
        url: "/schema/entrytypes",
        ...args,
      });
    },
    async getEntryTypeFields({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `/schema/entrytypes/${entryTypeId}/fields`,
        ...args,
      });
    },
    async getAllEntryTypeEntries({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `data/entrydata/${entryTypeId}/entries`,
        ...args,
      });
    },
  },
};
