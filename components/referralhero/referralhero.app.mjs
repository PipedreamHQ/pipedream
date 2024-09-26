import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "referralhero",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List",
      description: "Identifier of a list",
      async options({ page }) {
        const { data: { lists } } = await this.listLists({
          params: {
            page: page + 1,
          },
        });
        return lists?.map(({
          name: label, uuid: value,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "Email address of a subscriber",
      async options({
        listId, page,
      }) {
        const { data: { subscribers } } = await this.listSubscribers({
          listId,
          params: {
            page: page + 1,
          },
        });
        return subscribers?.map(({ email }) => email) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.referralhero.com/api/v2";
    },
    _apiKey() {
      return this.referralhero.api_key;
    },
    _authParams(params) {
      return {
        ...params,
        api_token: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    listSubscribers({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers`,
        ...args,
      });
    },
    addSubscriber({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers`,
        method: "POST",
        ...args,
      });
    },
    trackReferralConversionEvent({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers/track_referral_conversion_event`,
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {}, resourceType,
    }) {
      let total = 1;
      args = {
        ...args,
        params: {
          ...args.params,
          page: 1,
        },
      };

      do {
        const { data } = await resourceFn(args);
        const items = data[resourceType];
        for (const item of items) {
          yield item;
        }
        total = data.pagination.total_pages;
        args.params.page++;
      } while (args.params.page <= total);
    },
  },
};
