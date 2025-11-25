import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "neetokb",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return `https://${this.$auth.organization_name}.neetokb.com/api/v1`;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "X-Api-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listArticles(args = {}) {
      return this._makeRequest({
        path: "articles",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page_number = ++page;
        params.page_size = LIMIT;
        const {
          articles,
          pagination: {
            total_pages: tPages, current_page_number: cPage,
          },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of articles) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = cPage < tPages;

      } while (hasMore);
    },
  },
};
