import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kizeo_forms",
  version: "0.0.{{ts}}",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      optional: true,
    },
    exportId: {
      type: "string",
      label: "Export ID",
      description: "The ID of the export format (Word or Excel)",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format for the data export (csv or excel)",
      options: [
        "csv",
        "excel",
      ],
    },
    newUserDetails: {
      type: "object",
      label: "New User Details",
      description: "The details of the new user to create",
    },
    dataId: {
      type: "string",
      label: "Data ID",
      description: "The ID of the data to export to PDF",
    },
    optionalFormFieldIds: {
      type: "string[]",
      label: "Optional Form Field IDs",
      description: "An array of optional form field IDs",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.kizeoforms.com/rest/v3";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createNewUser({ newUserDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data: newUserDetails,
      });
    },
    async retrieveUnreadFormData() {
      return this._makeRequest({
        path: "/forms/data/unread",
      });
    },
    async exportFormData({
      formId, format,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/data/multiple/${format}`,
      });
    },
    async exportDataToPdf({
      formId, exportId, dataId,
    }) {
      return this._makeRequest({
        path: `/forms/${formId}/data/${dataId}/exports/${exportId}/pdf`,
      });
    },
  },
};
