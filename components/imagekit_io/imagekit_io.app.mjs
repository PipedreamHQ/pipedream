import { axios } from "@pipedream/platform";
import {
  limit, URLS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "imagekit_io",
  propDefinitions: {
    fileId: {
      type: "string",
      label: "File Id",
      description: "The Id of the file you want to get.",
      async options({ page }) {
        const data = await this.listFiles({
          params: {
            skip: limit * page,
            limit,
          },
        });

        return data.map(({
          fileId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl(baseUrl = "default") {
      return URLS[baseUrl];
    },
    _getAuth() {
      return {
        "username": this.$auth.private_key,
        "password": "",
      };
    },
    async _makeRequest({
      $ = this, path, baseUrl, ...opts
    }) {
      const config = {
        url: `${this._apiUrl(baseUrl)}/${path}`,
        auth: this._getAuth(),
        ...opts,
      };

      return axios($, config);
    },
    getFile({
      fileId, ...args
    }) {
      return this._makeRequest({
        path: `files/${fileId}/details`,
        ...args,
      });
    },
    listFiles(args = {}) {
      return this._makeRequest({
        path: "files",
        ...args,
      });
    },
    searchFiles(args = {}) {
      return this._makeRequest({
        path: "files",
        ...args,
      });
    },
    uploadImage(args = {}) {
      return this._makeRequest({
        baseUrl: "upload",
        method: "POST",
        path: "files/upload",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let length = false;
      let count = 0;
      let page = 0;
      params.limit = limit;

      do {
        params.skip = page * limit;
        page++;
        const data = await fn({
          params,
          ...args,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        length = data.length;

      } while (length);
    },
  },
};
