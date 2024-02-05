import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "livesession",
  methods: {
    _baseUrl() {
      return "https://api.livesession.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listSessions(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/sessions",
      });
    },
    async *paginate({
      resourceFn,
      params,
      resourceType,
      max,
    }) {
      params = {
        ...params,
        page: 0,
        size: constants.DEFAULT_LIMIT,
      };
      let count = 0;
      let total = 0;
      do {
        const response = await resourceFn({
          params,
        });
        const items = response[resourceType];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        params.page++;
        total = items?.length;
      } while (total === params.size);
    },
  },
};
