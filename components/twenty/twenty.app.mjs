import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "twenty",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update or delete.",
      optional: true, // Since it's not needed for creating a record
    },
    recordData: {
      type: "object",
      label: "Record Data",
      description: "The data for the new or updated record.",
    },
    actionType: {
      type: "string",
      label: "Action Type",
      description: "Specify the action to perform: create, update, or delete.",
      options: [
        {
          label: "Create",
          value: "create",
        },
        {
          label: "Update",
          value: "update",
        },
        {
          label: "Delete",
          value: "delete",
        },
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.twenty.com/rest/";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, data, params, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createRecord({ recordData }) {
      return this._makeRequest({
        method: "POST",
        path: "/records",
        data: recordData,
      });
    },
    async updateRecord({
      recordId, recordData,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/records/${recordId}`,
        data: recordData,
      });
    },
    async deleteRecord({ recordId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/records/${recordId}`,
      });
    },
    async performAction({
      actionType, recordId, recordData,
    }) {
      switch (actionType) {
      case "create":
        return this.createRecord({
          recordData,
        });
      case "update":
        return this.updateRecord({
          recordId,
          recordData,
        });
      case "delete":
        return this.deleteRecord({
          recordId,
        });
      default:
        throw new Error("Invalid action type");
      }
    },
  },
};
