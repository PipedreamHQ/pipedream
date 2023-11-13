import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dromo",
  propDefinitions: {
    schemaId: {
      type: "string",
      label: "Schema ID",
      description: "The ID of the import schema",
      async options() {
        const schemas = await this.getSchemas();
        return schemas.map((schema) => ({
          label: schema.name,
          value: schema.id,
        }));
      },
    },
    originalFilename: {
      type: "string",
      label: "Original Filename",
      description: "The original filename of the imported file",
    },
    importMetadata: {
      type: "object",
      label: "Import Metadata",
      description: "Additional metadata for the import",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "The URL of the source file for import",
    },
    destinationFolderId: {
      type: "string",
      label: "Destination Folder ID",
      description: "The ID of the destination folder for the imported file",
    },
    notificationPreferences: {
      type: "object",
      label: "Notification Preferences",
      description: "Preferences for import notifications",
      optional: true,
    },
    excludeFormats: {
      type: "string[]",
      label: "File Formats to Exclude",
      description: "File formats to exclude during the import",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.dromo.io/api/v1";
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
          Authorization: this.$auth.api_token,
        },
      });
    },
    async getSchemas() {
      return this._makeRequest({
        path: "/schemas",
      });
    },
    async createHeadlessImport(opts) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/headless/imports",
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
