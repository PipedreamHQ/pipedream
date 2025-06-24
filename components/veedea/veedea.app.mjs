import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "veedea",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of a campaign",
      async options({ page }) {
        const token = await this.getToken();
        const { data } = await this.listCampaigns({
          params: {
            page: page + 1,
          },
          token,
        });
        return data?.map(({
          id: value, camp_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://veedea.com/api";
    },
    _makeRequest({
      $ = this, path, token, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_key: this.$auth.api_key,
          token,
        },
        ...opts,
      });
    },
    async getToken() {
      const { token } = await this._makeRequest({
        path: "/auth",
      });
      return token;
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/getcampaign",
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/getleads",
        ...opts,
      });
    },
    listProductPurchases(opts = {}) {
      return this._makeRequest({
        path: "/productpurchase",
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
          limit: 100,
          page: 1,
        },
      };
      let total, count = 0;
      do {
        const { data } = await fn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = data?.length;
        args.params.page++;
      } while (total === args.params.limit);
    },
    async getPaginatedResources(opts) {
      const resources = [];
      const results = this.paginate(opts);
      for await (const item of results) {
        resources.push(item);
      }
      return resources;
    },
  },
};
