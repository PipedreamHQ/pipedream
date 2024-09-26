import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "giantcampaign",
  propDefinitions: {
    listUid: {
      type: "string",
      label: "List UID",
      description: "The unique identifier for the list.",
      async options({ page }) {
        const res = await this.getLists(page);
        return res.map((list) => ({
          label: list.name,
          value: list.uid,
        }));
      },
    },
    subscriberUid: {
      type: "string",
      label: "Subscriber UID",
      description: "The unique identifier for the subscriber.",
      async options({
        page,
        listUid,
      }) {
        const res = await this.getSubscribers(listUid, page + 1);
        return res.map((subscriber) => ({
          label: subscriber.email,
          value: subscriber.uid,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to add to the subscriber.",
    },
  },
  methods: {
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getBaseUrl() {
      return "https://acc.giantcampaign.com/api/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          api_token: this._getApiToken(),
          ...opts.params,
        },
      };
      return axios(ctx, axiosOpts);
    },
    async getLists(page, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/lists",
        params: {
          page,
          per_page: LIMIT,
        },
      }, ctx);
    },
    async getSubscribers(listUid, page, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/subscribers",
        params: {
          list_uid: listUid,
          page,
          per_page: LIMIT,
        },
      }, ctx);
    },
    async createSubscriber(data, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/subscribers",
        data,
      }, ctx);
    },
    async addTagsToSubscriber(subscriberId, tags, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/subscribers/${subscriberId}/add-tag`,
        data: {
          tag: tags,
        },
      }, ctx);
    },
  },
};
