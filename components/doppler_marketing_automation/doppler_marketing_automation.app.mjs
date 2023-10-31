import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "doppler_marketing_automation",
  propDefinitions: {
    listId: {
      label: "List ID",
      description: "The list ID",
      type: "string",
      async options() {
        const { items: resources } = await this.getLists();

        return resources.map((resource) => ({
          value: resource.listId,
          label: resource.name,
        }));
      },
    },
    subscriberEmail: {
      label: "Subscriber Email",
      description: "The subscriber email",
      type: "string",
      async options() {
        const { items: resources } = await this.getSubscribers();

        return resources.map((resource) => resource.email);
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _accountName() {
      return this.$auth.account_name;
    },
    _apiUrl() {
      return `https://restapi.fromdoppler.com/accounts/${this._accountName()}`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          ...args.headers,
          "Authorization": `token ${this._apiKey()}`,
        },
      });
    },
    async getLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    async getSubscribers(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        ...args,
      });
    },
    async getSubscriber({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/subscribers/${email}`,
        ...args,
      });
    },
    async addSubscriber(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        method: "post",
        ...args,
      });
    },
    async removeSubscriber({
      email, listId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers/${email}`,
        method: "delete",
        ...args,
      });
    },
  },
};
