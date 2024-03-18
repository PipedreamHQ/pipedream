import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sendloop",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options() {
        const { Lists: lists } = await this.listLists();
        return lists?.map(({
          ListID: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of a campaign",
      async options() {
        const { Campaigns: campaigns } = await this.listCampaigns();
        return campaigns?.map(({
          CampaignID: value, CampaignName: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    subscriberEmail: {
      type: "string",
      label: "Subscriber Email",
      description: "The email address of a subscriber",
      async options({
        listId, page,
      }) {
        const { Subscribers: subscribers } = await this.listSubscribers({
          data: {
            ListID: listId,
            Page: page,
          },
        });
        return subscribers?.map(({ EmailAddress: email }) => email) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.account}.sendloop.com/api/v3`;
    },
    _authData(data) {
      return {
        ...data,
        "APIKey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        data,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method: "POST",
        url: `${this._baseUrl()}/${path}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: this._authData(data),
      });
    },
    getSubscriber(opts = {}) {
      return this._makeRequest({
        path: "/Subscriber.Get/json",
        ...opts,
      });
    },
    listCampaigns({
      data, ...opts
    } = {}) {
      return this._makeRequest({
        path: "/Campaign.GetList/json",
        data: {
          ...data,
          IgnoreDrafts: 0,
          IgnoreSending: 0,
          IgnorePaused: 0,
          IgnoreSent: 0,
          IgnoreFaied: 0,
          IgnoreApproval: 0,
        },
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/List.GetList/json",
        ...opts,
      });
    },
    listSubscribers(opts = {}) {
      return this._makeRequest({
        path: "/Subscriber.Browse/json",
        ...opts,
      });
    },
    listEmailOpens(opts = {}) {
      return this._makeRequest({
        path: "/Data.Campaign.EmailOpens/json",
        ...opts,
      });
    },
    listBounces(opts = {}) {
      return this._makeRequest({
        path: "/Data.Campaign.Bounces/json",
        ...opts,
      });
    },
    addSubscriber(opts = {}) {
      return this._makeRequest({
        path: "/Subscriber.Subscribe/json",
        ...opts,
      });
    },
    removeSubscriber(opts = {}) {
      return this._makeRequest({
        path: "/Subscriber.Unsubscribe/json",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      resourceType,
      data,
    }) {
      data = {
        ...data,
        Limit: constants.DEFAULT_LIMIT,
        Page: 1,
      };
      let total = 0;
      do {
        const response = await resourceFn({
          data,
        });
        if (!response.Success) return;
        const items = response[resourceType];
        for (const item of items) {
          yield item;
        }
        total = items?.length;
        data.Page++;
      } while (total === data.Page);
    },
  },
};
