import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "quickbase",
  propDefinitions: {
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
    },
    recordData: {
      type: "object",
      label: "Record Data",
      description: "Field values for the new record",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update or delete",
    },
    updateData: {
      type: "object",
      label: "Update Data",
      description: "Field values to be updated",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.quickbase.com/v1";
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
          "QB-Realm-Hostname": this.$auth.realm_hostname,
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
      });
    },
    async createRecord({
      tableId, recordData,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tables/${tableId}/records`,
        data: recordData,
      });
    },
    async updateRecord({
      tableId, recordId, updateData,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tables/${tableId}/records/${recordId}`,
        data: updateData,
      });
    },
    async deleteRecord({
      tableId, recordId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/tables/${tableId}/records/${recordId}`,
      });
    },
  },
};
