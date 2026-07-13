import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "donately",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account to get. Use the **List Accounts** action to get a list of account IDs.",
    },
    donationId: {
      type: "string",
      label: "Donation ID",
      description: "The ID of the donation to get. Use the **List Donations** action to get a list of donation IDs.",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of a campaign. Use the **List Campaigns** action to get a list of campaign IDs.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to get.",
      default: 100,
      min: 1,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order. Either `ASC` or `DESC`.",
      options: [
        "ASC",
        "DESC",
      ],
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to sort by (e.g. `created_at`, `amount_in_cents`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.donately.com/v2";
    },
    _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...args,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    getDonation({
      donationId, ...opts
    }) {
      return this._makeRequest({
        path: `/donations/${donationId}`,
        ...opts,
      });
    },
    getCampaign({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}`,
        ...opts,
      });
    },
    getSubscription({
      subscriptionId, ...opts
    }) {
      return this._makeRequest({
        path: `/subscriptions/${subscriptionId}`,
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listDonations(opts = {}) {
      return this._makeRequest({
        path: "/donations",
        ...opts,
      });
    },
    listPeople(opts = {}) {
      return this._makeRequest({
        path: "/people",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listFundraisers(opts = {}) {
      return this._makeRequest({
        path: "/fundraisers",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...opts,
      });
    },
    async *paginate(fn, opts = {}, max) {
      opts = {
        ...opts,
        params: {
          ...opts.params,
          limit: max
            ? Math.min(max, 100)
            : 100,
          offset: 0,
        },
      };
      let total = 0;
      let count = 0;
      do {
        const { data } = await fn(opts);
        total = data?.length;
        if (!total) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        opts.params.offset += opts.params.limit;
      } while (total === opts.params.limit);
    },
    async getPaginatedResources(fn, opts = {}, max) {
      const results = [];
      for await (const result of this.paginate(fn, opts, max)) {
        results.push(result);
      }
      return results;
    },
  },
};
