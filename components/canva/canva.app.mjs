// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "canva",
  propDefinitions: {
    designId: {
      type: "string",
      label: "Design ID",
      description: "The ID of the design (e.g. `DAFq1234abcd`). Run **List Designs** first to obtain design IDs.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the design",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
      format: "file-ref",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the job is completed",
      optional: true,
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset (e.g. `MAHQxwKNGg0`). Obtain asset IDs from **Upload Asset** or **List Folder Items**.",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder (e.g. `FABc5678efgh`). Use `root` for top-level or discover sub-folder IDs via **List Folder Items**.",
    },
    brandTemplateId: {
      type: "string",
      label: "Brand Template ID",
      description: "The ID of the brand template (e.g. `DEMzWSwy3BI`). Discover IDs via **List Brand Templates**.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.canva.com/rest/v1";
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this._auth()}`,
        },
      });
    },
    listDesigns(opts = {}) {
      return this._makeRequest({
        path: "/designs",
        ...opts,
      });
    },
    getDesign({
      designId, ...opts
    }) {
      return this._makeRequest({
        path: `/designs/${designId}`,
        ...opts,
      });
    },
    getDesignDataset({
      designId, ...opts
    }) {
      return this._makeRequest({
        path: `/designs/${designId}/dataset`,
        ...opts,
      });
    },
    getUploadJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/asset-uploads/${jobId}`,
        ...opts,
      });
    },
    uploadAsset(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/asset-uploads",
        ...opts,
      });
    },
    getAsset({
      assetId, ...opts
    }) {
      return this._makeRequest({
        path: `/assets/${assetId}`,
        ...opts,
      });
    },
    updateAsset({
      assetId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/assets/${assetId}`,
        ...opts,
      });
    },
    deleteAsset({
      assetId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/assets/${assetId}`,
        ...opts,
      });
    },
    createDesign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/designs",
        ...opts,
      });
    },
    importDesign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/imports",
        ...opts,
      });
    },
    getDesignImportJob({
      importId, ...opts
    }) {
      return this._makeRequest({
        path: `/imports/${importId}`,
        ...opts,
      });
    },
    exportDesign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/exports",
        ...opts,
      });
    },
    getDesignExportJob({
      exportId, ...opts
    }) {
      return this._makeRequest({
        path: `/exports/${exportId}`,
        ...opts,
      });
    },
    createFolder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/folders",
        ...opts,
      });
    },
    getFolder({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}`,
        ...opts,
      });
    },
    updateFolder({
      folderId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/folders/${folderId}`,
        ...opts,
      });
    },
    deleteFolder({
      folderId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/folders/${folderId}`,
        ...opts,
      });
    },
    listFolderItems({
      folderId, ...opts
    }) {
      return this._makeRequest({
        path: `/folders/${folderId}/items`,
        ...opts,
      });
    },
    moveFolderItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/folders/move",
        ...opts,
      });
    },
    listBrandTemplates(opts = {}) {
      return this._makeRequest({
        path: "/brand-templates",
        ...opts,
      });
    },
    getBrandTemplate({
      brandTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/brand-templates/${brandTemplateId}`,
        ...opts,
      });
    },
    getBrandTemplateDataset({
      brandTemplateId, ...opts
    }) {
      return this._makeRequest({
        path: `/brand-templates/${brandTemplateId}/dataset`,
        ...opts,
      });
    },
    createAutofillJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/autofills",
        ...opts,
      });
    },
    getAutofillJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/autofills/${jobId}`,
        ...opts,
      });
    },
  },
};
