import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_campaigns",
  propDefinitions: {
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic to create your campaign",
      async options({ page }) {
        const res = await this.listTopics(page);
        if (!res.topicDetails) {
          return [];
        }
        return res.topicDetails.map((topic) => ({
          label: topic.topicName,
          value: topic.topicId,
        }));
      },
    },
    mailingList: {
      type: "string",
      label: "Mailing List",
      description: "The mailing list to send your campaign",
      async options({ page }) {
        const res = await this.listMailignLists(page);
        if (!res.list_of_details) {
          return [];
        }
        return res.list_of_details.map((list) => ({
          label: list.listname,
          value: list.listkey,
        }));
      },
    },
  },
  methods: {
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getBaseUrl() {
      return "https://campaigns.zoho.com/api/v1.1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Zoho-oauthtoken ${this._getAccessToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: {
          ...this._getHeaders(),
          ...opts.headers,
        },
      };

      return axios(ctx, axiosOpts);
    },
    async listTopics(page) {
      const LIMIT = 200;
      const fromIndex = page * LIMIT + 1;
      return this._makeHttpRequest({
        path: "/topics",
        params: {
          details: `{ "from_index": ${fromIndex}, "range": ${LIMIT} }`,
        },
      });
    },
    async listMailignLists(page) {
      const LIMIT = 200;
      const fromIndex = page * LIMIT + 1;
      return this._makeHttpRequest({
        path: "/getmailinglists",
        params: {
          resfmt: "JSON",
          fromindex: fromIndex,
          range: LIMIT,
        },
      });
    },
    async createCampaign(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/createCampaign",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          ...data,
          resfmt: "JSON",
        },
      });
    },
    async addSubscriberToList(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/json/listsubscribe",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          ...data,
          resfmt: "JSON",
        },
      });
    },
    async listRecentCampaigns(page, startIndex) {
      const LIMIT = 200;
      const fromIndex = startIndex + (page * LIMIT + 1);
      return this._makeHttpRequest({
        path: "/recentcampaigns",
        params: {
          resfmt: "JSON",
          sort: "asc",
          status: "all",
          fromindex: fromIndex,
          range: LIMIT,
        },
      });
    },
    async listContacts(page, startIndex, listKey) {
      const LIMIT = 200;
      const fromIndex = startIndex + (page * LIMIT + 1);
      return this._makeHttpRequest({
        path: "/getlistsubscribers",
        params: {
          listkey: listKey,
          sort: "asc",
          resfmt: "JSON",
          fromindex: fromIndex,
          range: LIMIT,
        },
      });
    },
  },
};
