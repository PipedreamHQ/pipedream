import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "campaignhq",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list to retrieve.",
      async options({
        prevContext,
        page,
      }) {
        if (page + 1 > prevContext?.totalPages) {
          return [];
        }
        const res = await this.listLists(page + 1);
        return {
          options: res.data?.map((list) => ({
            label: list.name,
            value: list.id,
          })),
          context: {
            totalPages: res.totalPages,
          },
        };
      },
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.campaignhq.co/api/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getApiKey()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async createList(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/lists",
        data,
      });
    },
    async createContact(listId, data) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/lists/${listId}/contacts`,
        data,
      });
    },
    async listLists(page) {
      const PAGE_SIZE = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/lists",
        params: {
          page,
          per_page: PAGE_SIZE,
        },
      });
    },
    async listContactsByList(listId, page) {
      const PAGE_SIZE = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: `/lists/${listId}/contacts`,
        params: {
          page,
          per_page: PAGE_SIZE,
        },
      });
    },
  },
};
