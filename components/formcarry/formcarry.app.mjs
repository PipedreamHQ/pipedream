import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formcarry",
  methods: {
    _baseUrl() {
      return "https://formcarry.com/api";
    },
    _headers() {
      return {
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listSubmissions({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/form/${formId}/submissions`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      args = {},
      resourceKey,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: 50,
          page: 1,
        },
      };
      let nextPage, count = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        nextPage = response.pagination.next_page;
        args.params.page = nextPage;
      } while (nextPage);
    },
  },
};
