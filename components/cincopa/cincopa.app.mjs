import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cincopa",
  propDefinitions: {
    fid: {
      type: "string",
      label: "Gallery FID",
      description: "Gallery FID to add the assets",
      async options({ page }) {
        const { galleries } = await this.listGalleries({
          params: {
            page: page + 1,
          },
        });
        return galleries.map(({
          fid: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    rid: {
      type: "string[]",
      label: "Asset RIDs",
      description: "List of RIDs (assets id) to be added",
      optional: true,
      useQuery: true,
      async options({
        query: search, page,
      }) {
        const { items } = await this.listAssets({
          params: {
            search,
            page: page + 1,
          },
        });
        return items.map(({
          rid: value, filename: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuthParams(params) {
      return {
        ...params,
        api_token: this.$auth.api_token,
      };
    },
    _makeRequest({
      $ = this, path, params, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        params: this.getAuthParams(params),
      });
    },
    listGalleries(args = {}) {
      return this._makeRequest({
        path: "/gallery.list.json",
        ...args,
      });
    },
    listAssets(args = {}) {
      return this._makeRequest({
        path: "/asset.list.json",
        ...args,
      });
    },
  },
};
