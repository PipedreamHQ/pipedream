import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easypromos",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user",
      async options({
        promotionId, prevContext,
      }) {
        const {
          items, paging,
        } = await this.getUsers({
          promotionId,
          params: {
            next_cursor: prevContext.nextCursor,
          },
        });
        return {
          options: items.map(({
            id: value, email: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: paging.next_cursor,
          },
        };
      },
    },
    promotionId: {
      type: "integer",
      label: "Promotion ID",
      description: "The ID of the promotion",
      async options({ prevContext }) {
        const {
          items, paging,
        } = await this.getPromotions({
          params: {
            next_cursor: prevContext.nextCursor,
          },
        });
        return {
          options: items.map(({
            id, title, internal_ref: ref,
          }) => ({
            label: ref || title,
            value: parseInt(id),
          })),
          context: {
            nextCursor: paging.next_cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.easypromosapp.com/v2";
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
    getCoinTransactions({
      promotionId, ...opts
    }) {
      return this._makeRequest({
        path: `/coin_transactions/${promotionId}`,
        ...opts,
      });
    },
    getUsers({
      promotionId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${promotionId}`,
        ...opts,
      });
    },
    getParticipations({
      promotionId, ...opts
    }) {
      return this._makeRequest({
        path: `/participations/${promotionId}`,
        ...opts,
      });
    },
    getPromotions(opts = {}) {
      return this._makeRequest({
        path: "/promotions",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let nextCursor = null;

      do {
        params.next_cursor = nextCursor;
        const {
          items,
          paging: { next_cursor },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextCursor = next_cursor;
        hasMore = nextCursor;

      } while (hasMore);
    },
  },
};
