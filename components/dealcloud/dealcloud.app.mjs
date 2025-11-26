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
    ignoreNearDups: {
      type: "boolean",
      label: "Ignore Near Duplicates",
      description: "Whether to ignore near duplicates when creating a record.",
      optional: true,
      default: false,
    },
  },
  methods: {
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      const config = {
        baseURL: `${this.$auth.host}/api/rest/v4`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      };
      return axios($, config);
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
        url: `/data/entrydata/${entryTypeId}/entries`,
        ...args,
      });
    },
    async queryEntries({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `/data/entrydata/rows/${entryTypeId}`,
        ...args,
      });
    },
    async createEntry({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `/data/entrydata/${entryTypeId}`,
        method: "POST",
        ...args,
      });
    },
    async updateEntry({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `/data/entrydata/${entryTypeId}`,
        method: "PUT",
        ...args,
      });
    },
    async deleteEntry({
      entryTypeId, ...args
    }) {
      return this._makeRequest({
        url: `/data/entrydata/${entryTypeId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
