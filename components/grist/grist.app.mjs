import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "grist",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table in which to operate",
    },
    recordData: {
      type: "object",
      label: "Record Data",
      description: "The data for the new or updated record",
    },
    matchKeys: {
      type: "object",
      label: "Match Keys",
      description: "The keys to identify records for potential update",
      optional: true,
    },
    searchParameters: {
      type: "object",
      label: "Search Parameters",
      description: "The parameters to search for the record",
      optional: true,
    },
    recordsData: {
      type: "string[]",
      label: "Records Data",
      description: "The data for the records to append in bulk",
    },
  },
  methods: {
    _baseUrl() {
      return `https://{subdomain}.getgrist.com/api`;
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createOrUpdateRecord({
      tableName, recordData, matchKeys,
    }) {
      const body = {
        records: [
          {
            require: matchKeys || {},
            fields: recordData,
          },
        ],
      };
      return this._makeRequest({
        method: "PUT",
        path: `/docs/${this.docId}/tables/${tableName}/records`,
        data: body,
      });
    },
    async searchAndCreateRecord({
      tableName, recordData, searchParameters,
    }) {
      // Search for the record using the provided searchParameters
      const existingRecord = await this.searchRecord({
        tableName,
        searchParameters,
      });

      // If record exists, return it
      if (existingRecord) {
        return existingRecord;
      }

      // If not, create a new record
      return this.createOrUpdateRecord({
        tableName,
        recordData,
        matchKeys: searchParameters,
      });
    },
    async searchRecord({
      tableName, searchParameters,
    }) {
      // Implement the search logic based on the API's capabilities
      // This is a placeholder for the search logic
      // Return the record if found
    },
    async appendRecords({
      tableName, recordsData,
    }) {
      const records = recordsData.map(JSON.parse);
      return this._makeRequest({
        method: "POST",
        path: `/docs/${this.docId}/tables/${tableName}/records`,
        data: {
          records,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
