import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "canva",
  propDefinitions: {
    designId: {
      type: "string",
      label: "Design ID",
      description: "The ID of the design",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the exported file",
      options: [
        "pdf",
        "jpg",
        "png",
        "gif",
        "pptx",
        "mp4",
      ],
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset to add to the new design",
      optional: true,
    },
    presetDesignType: {
      type: "string",
      label: "Preset Design Type",
      description: "The type of the preset design",
      optional: true,
    },
    customHeight: {
      type: "integer",
      label: "Custom Height",
      description: "The height of the custom design",
      optional: true,
    },
    customWidth: {
      type: "integer",
      label: "Custom Width",
      description: "The width of the custom design",
      optional: true,
    },
    externalFile: {
      type: "string",
      label: "External File",
      description: "The path to the external file to import as a new design",
      optional: true,
    },
    importMetadata: {
      type: "object",
      label: "Import Metadata",
      description: "The metadata about the import",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the transfer payment",
      options: [
        "in_progress",
        "success",
        "failed",
      ],
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.canva.com/rest/v1";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitStatusChangeEvent(status) {
      this.$emit({
        status,
      }, {
        summary: `Status changed to ${status}`,
      });
    },
    async listEntities() {
      return this._makeRequest({
        path: "/entities",
      });
    },
    async createDesign({
      presetDesignType, customHeight, customWidth, assetId,
    }) {
      const designType = presetDesignType
        ? {
          type: "preset",
          name: presetDesignType,
        }
        : {
          type: "custom",
          height: customHeight,
          width: customWidth,
        };
      return this._makeRequest({
        method: "POST",
        path: "/designs",
        data: {
          design_type: designType,
          asset_id: assetId,
        },
      });
    },
    async importDesign({
      externalFile, importMetadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/imports",
        headers: {
          "Content-Type": "application/octet-stream",
          "Import-Metadata": JSON.stringify(importMetadata),
        },
        data: externalFile,
      });
    },
    async exportDesign({
      designId, format,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/exports",
        data: {
          design_id: designId,
          format: {
            type: format,
          },
        },
      });
    },
    async getDesignExportJob({ jobId }) {
      return this._makeRequest({
        path: `/exports/${jobId}`,
      });
    },
  },
};
