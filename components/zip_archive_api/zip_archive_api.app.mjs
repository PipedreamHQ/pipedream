import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zip_archive_api",
  propDefinitions: {
    archiveName: {
      type: "string",
      label: "Archive Name",
      description: "Compressed archive name",
    },
    compressionLevel: {
      type: "integer",
      label: "Compression Level",
      description: "Archive compression level. Value range: 1-9",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The compressed ZIP archive password",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "Files URLs",
      description: "The URLs of the files to be compressed",
    },
    file: {
      type: "string",
      label: "File URL",
      description: "The URL of the archive to extract the files from",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.archiveapi.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          secret: `${this.$auth.secret}`,
        },
      });
    },
    async compressFiles(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/zip",
        ...args,
      });
    },
    async extractFiles(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/extract",
        ...args,
      });
    },
  },
};
