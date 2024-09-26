import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helloleads",
  propDefinitions: {
    listKey: {
      type: "string",
      label: "List Key",
      description: "The key of the list.",
      async options({ page }) {
        const { lists } = await this.listLists({
          params: {
            page: page + 1,
          },
        });

        return lists.filter(({ list_key }) => list_key).map(({
          list_key: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.helloleads.io/index.php/private/api";
    },
    _getHeaders() {
      return {
        "hls-key": `token=${this.$auth.api_key}`,
        "Xemail": `${this.$auth.email}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createLead(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "leads",
        ...args,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "leads",
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "lists",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          leads,
          paging: {
            total_pages: totalPages,
            current_page: currentPage,
          },
        } = await fn({
          params,
        });
        for (const d of leads) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = currentPage != totalPages;

      } while (hasMore);
    },
  },
};
