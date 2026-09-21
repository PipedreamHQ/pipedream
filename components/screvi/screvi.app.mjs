import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "screvi",
  propDefinitions: {
    tag: {
      type: "string",
      label: "Tag",
      description: "Only include items carrying this tag",
      async options() {
        const { data } = await this.listTags({});
        return data.map(({ name }) => name);
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tag names to apply. They must already exist in your Screvi account",
      optional: true,
      async options() {
        const { data } = await this.listTags({});
        return data.map(({ name }) => name);
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The article to act on",
      async options({ page }) {
        const { data } = await this.listArticles({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return data.map(({
          id, title, url,
        }) => ({
          label: title || url,
          value: id,
        }));
      },
    },
    homeStatus: {
      type: "string",
      label: "Status",
      description: "Where the article sits: the inbox, Later, or the archive",
      options: [
        "inbox",
        "later",
        "archive",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Stop after this many items",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.screvi.com/api/v1";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    listHighlights(opts = {}) {
      return this._makeRequest({
        path: "/highlights",
        ...opts,
      });
    },
    searchHighlights(opts = {}) {
      return this._makeRequest({
        path: "/search",
        ...opts,
      });
    },
    listArticles(opts = {}) {
      return this._makeRequest({
        path: "/articles",
        ...opts,
      });
    },
    saveArticle(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/articles",
        ...opts,
      });
    },
    updateArticle({
      articleId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/articles/${articleId}`,
        ...opts,
      });
    },
    /**
     * Screvi paginates with `page` and reports `has_more`, so walk forward until
     * the API says there is nothing left or the caller has seen enough.
     */
    async *paginate({
      fn, params = {}, max,
    }) {
      let page = 1;
      let count = 0;

      while (true) {
        const {
          data, pagination,
        } = await fn({
          params: {
            ...params,
            page,
            per_page: 100,
          },
        });

        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }

        if (!pagination?.has_more) {
          return;
        }
        page++;
      }
    },
  },
};
