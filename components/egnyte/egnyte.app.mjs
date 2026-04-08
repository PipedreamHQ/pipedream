import { axios } from "@pipedream/platform";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 500, // 2 requests per second
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

export default {
  type: "app",
  app: "egnyte",
  propDefinitions: {
    filename: {
      type: "string",
      label: "Filename",
      description: "The name of the file to download",
      async options({ folderPath }) {
        const { files } = await this.getFolder({
          folderPath,
        });
        return files?.map?.((file) => file.name) || [];
      },
    },
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "The path to a folder in your Egnyte workspace",
      useQuery: true,
      async options({ query }) {
        if (query) {
          const { results } = await this.search({
            params: {
              query,
              type: "FOLDER",
            },
          });
          return results?.map?.((result) => result.path) || [];
        }
        const { folders } = await this.getFolder({
          folderPath: "",
        });
        return folders?.map?.((folder) => folder.path) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.egnyte.com/pubapi/v1`;
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      };
      return axiosRateLimiter($, config);
    },
    getFolder({
      folderPath, ...opts
    }) {
      return this._makeRequest({
        path: `/fs/${folderPath}`,
        ...opts,
      });
    },
    search(opts = {}) {
      return this._makeRequest({
        path: "/search",
        ...opts,
      });
    },
    createFolder({ folderPath }) {
      return this._makeRequest({
        method: "POST",
        path: `/fs/${folderPath}`,
        data: {
          action: "add_folder",
        },
      });
    },
    uploadFile({
      folderPath, filename, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/fs-content/${folderPath}/${filename}`,
        ...opts,
      });
    },
    downloadFile({
      folderPath, filename, ...opts
    }) {
      return this._makeRequest({
        path: `/fs-content/${folderPath}/${filename}`,
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
