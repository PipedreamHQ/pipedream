import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sidetracker",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique ID of a list",
      async options({ page }) {
        const { results: lists }  = await this.listLists({
          params: {
            page: page + 1,
          },
        });
        return lists?.map(({
          unique_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.sidetracker.io/api";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: this.$auth.api_key,
        },
        ...opts,
      });
    },
    getList({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/lists/${listId}`,
        ...opts,
      });
    },
    getRow({
      listId, rowId, ...opts
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/get/row/${rowId}`,
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listSessions({
      domainId, ...opts
    }) {
      return this._makeRequest({
        path: `/tracking/sessions/${domainId}`,
        ...opts,
      });
    },
    addRowToList({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/add/row`,
        ...opts,
      });
    },
    async *paginate({
      fn, params, max,
    }) {
      params = {
        ...params,
        page: 1,
        page_size: 100,
      };
      let hasMore, count = 0;;
      do {
        const {
          results, next,
        } = await fn({
          params,
        });
        if (!results?.length) {
          return;
        }
        for (const result of results) {
          yield result;
          if (max && ++count === max) {
            return count;
          }
        }
        hasMore = next;
        params.page++;
      } while (hasMore);
    },
  },
};
