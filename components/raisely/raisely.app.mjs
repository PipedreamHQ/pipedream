import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "raisely",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "Filter events to the specific campaign only. If omitted you will receive events for the whole Raisely account.",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: limit * page,
        };
        const { data } = await this.listCampaigns({
          params,
        });
        return data?.map(({
          uuid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.raisely.com/v3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        Accept: "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listDonations(args = {}) {
      return this._makeRequest({
        path: "/donations",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    createOrUpdateUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {},
    }) {
      const limit = constants.DEFAULT_LIMIT;
      let total = 0;
      args = {
        ...args,
        params: {
          ...args.params,
          limit,
          offset: 0,
        },
      };

      do {
        const { data } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        total = data?.length;
        args.params.offset += limit;
      } while (total === limit);
    },
  },
};
