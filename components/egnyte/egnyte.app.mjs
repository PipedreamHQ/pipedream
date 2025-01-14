import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "egnyte",
  version: "0.0.{{ts}}",
  propDefinitions: {
    monitoredFolderPath: {
      type: "string",
      label: "Folder Path to Monitor",
      description: "The path of the folder to monitor for new files, e.g., /Shared/Documents.",
    },
    newFolderName: {
      type: "string",
      label: "Folder Name",
      description: "The name of the new folder to create.",
    },
    parentFolderId: {
      type: "string",
      label: "Parent Folder ID",
      description: "The ID of the parent folder. Leave blank to create in the root directory.",
      optional: true,
    },
    uploadFileContent: {
      type: "string",
      label: "File Content",
      description: "The base64 encoded content of the file to upload.",
    },
    uploadFolderId: {
      type: "string",
      label: "Upload Folder ID",
      description: "The ID of the folder where the file will be uploaded.",
    },
    uploadFileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file. Leave blank to use a default name.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return `https://${this.$auth.domain}.egnyte.com/pubapi/v1`;
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($ || this, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    async listSharedFolders(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/fs/shared",
        ...opts,
      });
    },
    async monitorFolder({ folderPath }) {
      return this._makeRequest({
        method: "GET",
        path: `/fs/${encodeURIComponent(folderPath)}/files`,
      });
    },
    async createFolder({
      folderName, parentFolderId,
    }) {
      const path = parentFolderId
        ? `/fs/${encodeURIComponent(parentFolderId)}/folders`
        : "/fs/shared/folders";
      const data = {
        name: folderName,
      };
      return this._makeRequest({
        method: "POST",
        path,
        data,
      });
    },
    async uploadFile({
      fileContent, uploadFolderId, fileName,
    }) {
      const name = fileName || "uploaded_file";
      const path = `/fs/${encodeURIComponent(uploadFolderId)}/files/${encodeURIComponent(name)}`;
      return this._makeRequest({
        method: "PUT",
        path,
        data: Buffer.from(fileContent, "base64"),
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
    },
    async listFolders({ folderPath }) {
      const path = `/fs/${encodeURIComponent(folderPath)}/folders`;
      return this._makeRequest({
        method: "GET",
        path,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response;
      let page = 1;
      while (true) {
        response = await fn({
          page,
          ...opts,
        });
        if (!response.items || response.items.length === 0) break;
        results = results.concat(response.items);
        page += 1;
      }
      return results;
    },
  },
};
