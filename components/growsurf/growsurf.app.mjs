import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "growsurf",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of a campaign",
      async options() {
        const { campaigns } = await this.listCampaigns();
        return campaigns?.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.growsurf.com/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listParticipants({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaign/${campaignId}/participants`,
        ...opts,
      });
    },
    listReferrals({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        path: `/campaign/${campaignId}/referrals`,
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args.params = args.params || {};
      let hasMore = true;
      let count = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = response.nextId;
        args.params.nextId = response.nextId;
      } while (hasMore);
    },
  },
};
