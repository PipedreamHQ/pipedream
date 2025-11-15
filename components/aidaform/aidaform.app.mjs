import { axios } from "@pipedream/platform";
const LIMIT = 100;

export default {
  type: "app",
  app: "aidaform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for new responses",
      async options() {
        const { items } = await this.listForms();
        return items.map(({
          id, data: { name },
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.aidaform.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `${this.$auth.api_key}`,
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
    listForms(args = {}) {
      return this._makeRequest({
        path: "forms",
        ...args,
      });
    },
    listResponses({
      formId, ...args
    }) {
      return this._makeRequest({
        path: `forms/${formId}/responses`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = null;
      let count = 0;

      do {
        params.limit = LIMIT;
        params.marker = hasMore;
        const {
          items, marker: nextMarker,
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

        hasMore = nextMarker;

      } while (hasMore);
    },
  },
};
