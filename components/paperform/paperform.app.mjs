import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "paperform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor",
      async options({ page }) {
        const { results: { forms } } = await this.listForms({
          params: {
            limit: DEFAULT_LIMIT,
            skip: page * DEFAULT_LIMIT,
          },
        });
        return forms?.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paperform.co/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    createHook({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}/webhooks`,
        method: "POST",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
      });
    },
    listSubmissions({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}/submissions`,
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
          skip: 0,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          results, has_more: more,
        } = await fn(args);
        const items = results[resourceKey];
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = more;
        args.params.skip += args.params.limit;
      } while (hasMore);
    },
  },
};
