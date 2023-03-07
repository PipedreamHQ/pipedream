import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "swaggerhub",
  propDefinitions: {},
  methods: {
    _auth() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.swaggerhub.com";
    },
    async _makeRequest({
      $ = this, path = "", ...opts
    }) {
      const response = await axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          Authorization: this._auth(),
        },
      });
      return response;
    },
    async listApis({
      paginate = false, owner, ...opts
    }) {
      const path = `/apis/${owner}`;

      if (paginate) {
        const results = [];
        let page = -1;

        while (true) {
          const { apis } = await this._makeRequest({
            ...opts,
            path,
            params: {
              ...opts.params,
              page: ++page,
              limit: constants.MAX_LIMIT,
            },
          });

          results.push(...apis);

          if (apis.length < constants.MAX_LIMIT) {
            return {
              apis: results,
              page,
            };
          }
        }
      }

      return this._makeRequest({
        ...opts,
        path,
      });
    },
  },
};
