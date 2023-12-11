import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "file_store",
  propDefinitions: {
    directory: {
      type: "string",
      label: "Directory",
      description: "The directory to list or upload files to. Leave blank to use the root directory.",
      optional: true,
      async options({ prevContext }) {
        const page = prevContext.page || 0;
        const dirs = await this.listFiles({
          path: "",
          page,
        });
        return dirs
          .filter((dir) => dir.isDirectory())
          .map((dir) => ({
            label: dir.path,
            value: dir.path,
          }));
      },
    },
    file: {
      type: "string",
      label: "File",
      description: "The name of the file to perform operations on.",
      async options({ directory }) {
        const files = await this.listFiles({
          path: directory || "",
        });
        return files
          .filter((file) => file.isFile())
          .map((file) => ({
            label: file.name,
            value: file.path,
          }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.pipedream.com/v1";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listFiles({
      path = "", page = 0,
    }) {
      const files = await this._makeRequest({
        path: "/files/dir",
        params: {
          path,
          page,
        },
      });
      return files;
    },
    async uploadFileFromPath({
      localFilePath, fileName, contentType,
    }) {
      const file = await this._makeRequest({
        method: "POST",
        path: `/files/open/${encodeURIComponent(fileName)}/fromFile`,
        data: {
          localFilePath,
          contentType,
        },
      });
      return file.url;
    },
    async createWriteStream({
      fileName, contentType, contentLength,
    }) {
      const writeStream = await this._makeRequest({
        method: "POST",
        path: `/files/open/${encodeURIComponent(fileName)}/createWriteStream`,
        data: {
          contentType,
          contentLength,
        },
      });
      return writeStream;
    },
    async downloadFile({
      fileName, localPath,
    }) {
      await this._makeRequest({
        method: "GET",
        path: `/files/open/${encodeURIComponent(fileName)}/toFile`,
        params: {
          path: localPath,
        },
      });
    },
    async uploadFileFromUrl({
      url, fileName,
    }) {
      const file = await this._makeRequest({
        method: "POST",
        path: `/files/open/${encodeURIComponent(fileName)}/fromUrl`,
        data: {
          url,
        },
      });
      return file.url;
    },
  },
};
