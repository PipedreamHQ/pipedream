import { axios } from "@pipedream/platform";
import { clearObj } from "./common/utils.mjs";

export default {
  type: "app",
  app: "readwise",
  propDefinitions: {
    bookId: {
      type: "integer",
      label: "Book Id",
      description: "Id of the book to list highlights",
      async options({ page }) {
        const { results } = await this.listBooks({
          params: {
            page: page + 1,
          },
        });

        return results.map(({
          title, id,
        }) => ({
          label: title,
          value: id,
        })) || [];
      },
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Specify number of results per page (default is 100, max is 1000)",
      default: 100,
    },
    highlightId: {
      type: "integer",
      label: "Highlight Id",
      description: "Id of the highlight to list details",
      async options({
        page, bookId: book_id,
      }) {
        const { results } = await this.listHighlights({
          params: {
            book_id,
            page: page + 1,
          },
        });

        return results.map(({
          text, id,
        }) => ({
          label: `(${id}) ${text}`,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://readwise.io/api/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Token ${this.$auth.accesss_token}`,
      };
    },
    async _makeRequest({
      $, path, ...otherConfig
    }) {
      const config = {
        url: `${this._getBaseUrl()}/${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      return axios($ || this, clearObj(config));
    },
    async listBooks({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "books",
        params,
      });
    },
    async listHighlights({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "highlights",
        params,
      });
    },
    async getHighlight({
      $, highlightId,
    }) {
      return this._makeRequest({
        $,
        path: `highlights/${highlightId}`,
      });
    },
    async *paginate({
      $, fn, params = {}, page,
    }) {
      const { limit } = params;
      let count = 0;

      do {
        const {
          results,
          next,
        } = await fn({
          $,
          params: {
            ...params,
            page,
          },
        });

        for (const d of results) {
          yield d;

          if (limit && ++count === limit) {
            return count;
          }
        }
        page = null;

        if (next) {
          const regex = next.match(/page=([^&]+)/g);
          const pageNumber = regex[0].split("=");
          page = pageNumber[1];
        }

      } while (page);
    },
  },
};
