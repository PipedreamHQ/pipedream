import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "drata",
  propDefinitions: {},
  methods: {
    async _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        url: `https://public-api.drata.com/public${path}`,
        headers: {
          ...opts.headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const results = [];
      let page = opts.params?.page || 1;

      while (true) {
        const response = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit: constants.PAGINATION_LIMIT,
            page,
          },
        });

        results.push(...response.data);

        if (response.data.length < constants.PAGINATION_LIMIT) {
          return {
            ...response,
            data: results,
          };
        }

        page++;
      }
    },
    async listPersonnel({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listPersonnel,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/personnel",
      });
    },
    async listAssets({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listAssets,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/assets",
      });
    },
    async listControls({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listControls,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/controls",
      });
    },
  },
};
