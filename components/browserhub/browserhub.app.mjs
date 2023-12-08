import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "browserhub",
  propDefinitions: {
    scraperId: {
      type: "string",
      label: "Scraper ID",
      description: "The unique identifier for the scraper automation designed to run",
      async options({ page }) {
        const { data } = await this.listScrapers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.browserhub.io/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createRun(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/runs",
        ...opts,
      });
    },
    listRuns(opts = {}) {
      return this._makeRequest({
        path: "/runs",
        ...opts,
      });
    },
    listScrapers(opts = {}) {
      return this._makeRequest({
        path: "/scrapers",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, baseDate,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          next_page: nextPage,
        } = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (baseDate && (new Date(baseDate) > new Date(d.created_at))) break;
          if (maxResults && ++count === maxResults) return count;
        }

        hasMore = nextPage;

      } while (hasMore);
    },
  },
};
