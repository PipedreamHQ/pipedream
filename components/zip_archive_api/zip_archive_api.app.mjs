import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zip_archive_api",
  propDefinitions: {
    uploadType: {
      type: "string",
      label: "Upload Type",
      description: "The upload type of the file",
      options: constants.UPLOAD_TYPES,
    },
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
      label: "File Paths or URLs",
      description: "The files to upload. For each entry, provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
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
  },
};
