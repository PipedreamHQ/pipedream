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
