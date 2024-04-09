import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nextcloud",
  propDefinitions: {
    directory: {
      type: "string",
      label: "Directory",
      description: "Directory to monitor for file creation or updates",
    },
    fileType: {
      type: "string",
      label: "File Type",
      description: "Type of file to monitor for creation or updates",
      optional: true,
    },
    sourcePath: {
      type: "string",
      label: "Source Path",
      description: "Original location of the file or folder to be copied",
    },
    destinationPath: {
      type: "string",
      label: "Destination Path",
      description: "Location where the copy will be placed",
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description: "Define if existing files at the destination should be replaced",
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "Location of the file or folder to delete or where the new folder will be created",
    },
  },
  methods: {
    _baseUrl() {
      return "https://your-nextcloud-instance.com";
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
          "OCS-APIRequest": "true",
          "Authorization": `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async emitFileEvent(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/ocs/v2.php/apps/files/api/v1/files",
        method: "GET",
      });
    },
    async copyFileOrFolder({
      sourcePath, destinationPath, overwrite = false,
    }) {
      return this._makeRequest({
        method: "COPY",
        path: `/remote.php/dav/files/${this.$auth.username}/${sourcePath}`,
        headers: {
          Destination: `${this._baseUrl()}/remote.php/dav/files/${this.$auth.username}/${destinationPath}`,
          Overwrite: overwrite
            ? "T"
            : "F",
        },
      });
    },
    async createFolder({ path }) {
      return this._makeRequest({
        method: "MKCOL",
        path: `/remote.php/dav/files/${this.$auth.username}/${path}`,
      });
    },
    async deleteFileOrFolder({ path }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/remote.php/dav/files/${this.$auth.username}/${path}`,
      });
    },
  },
};
