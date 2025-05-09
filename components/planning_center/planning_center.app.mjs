import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

export default {
  type: "app",
  app: "planning_center",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to monitor for new persons",
      async options({ page }) {
        const { data } = await this.listLists({
          params: {
            per_page: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map(({
          id: value, attributes,
        }) => ({
          label: attributes.name_or_description,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.planningcenteronline.com";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    getListResult({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/people/v2/lists/${listId}/list_results`,
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/people/v2/lists",
        ...opts,
      });
    },
    listDonations(opts = {}) {
      return this._makeRequest({
        path: "/giving/v2/donations",
        ...opts,
      });
    },
    getCalendarEvents(opts = {}) {
      return this._makeRequest({
        path: "/calendar/v2/events",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          per_page: MAX_LIMIT,
          offset: 0,
        },
      };
      let total, count = 0;

      do {
        const { data } = await fn(args);
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = data?.length;
        args.params.offset += args.params.per_page;
      } while (total);
    },
  },
};
