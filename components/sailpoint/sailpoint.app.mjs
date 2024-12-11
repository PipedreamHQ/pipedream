import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "identitynow",
  propDefinitions: {
    // Props for uploading CSV account file
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "ID of the source to upload the account file.",
    },
    csvAccountFile: {
      type: "string",
      label: "CSV Account File",
      description: "CSV-formatted account file content.",
    },
    // Props for retrieving certification campaigns
    filter: {
      type: "string",
      label: "Filter",
      description: "Optional filter to adjust campaign retrieval.",
      optional: true,
    },
    // Props for submitting access request
    requestedFor: {
      type: "string[]",
      label: "Requested For",
      description: "List of Identity IDs for whom the Access is requested.",
    },
    requestType: {
      type: "string",
      label: "Request Type",
      description: "Type of access request.",
      options: [
        {
          label: "Grant Access",
          value: "GRANT_ACCESS",
        },
        {
          label: "Revoke Access",
          value: "REVOKE_ACCESS",
        },
      ],
      optional: true,
    },
    requestedItems: {
      type: "string[]",
      label: "Requested Items",
      description: "List of requested items as JSON strings.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://sailpoint.api.identitynow.com/v2024";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async uploadCsvAccountFile() {
      const {
        sourceId, csvAccountFile,
      } = this;
      const formData = new FormData();
      formData.append("file", csvAccountFile, "accounts.csv");
      return this._makeRequest({
        method: "POST",
        path: `/v3/sources/${sourceId}/schemas/accounts`,
        headers: {
          ...formData.getHeaders(),
          "X-SailPoint-Experimental": "true",
        },
        data: formData,
      });
    },
    async retrieveCertificationCampaigns() {
      const { filter } = this;
      const params = {};
      if (filter) {
        params.filter = filter;
      }
      return this._makeRequest({
        method: "GET",
        path: "/campaigns",
        params,
      });
    },
    async submitAccessRequest() {
      const {
        requestedFor, requestType, requestedItems,
      } = this;
      const data = {
        requestedFor,
        requestType: requestType || "GRANT_ACCESS",
        requestedItems: requestedItems.map((item) => JSON.parse(item)),
      };
      return this._makeRequest({
        method: "POST",
        path: "/access-requests",
        data,
      });
    },
  },
  version: `0.0.${Date.now()}`,
};
