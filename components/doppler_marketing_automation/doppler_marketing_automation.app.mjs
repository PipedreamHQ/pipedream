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
        const resources = await this.getLists();
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
      async options({ listId }) {
        const resources = await this.getSubscribers({
          listId,
        });
        return resources.map((resource) => resource.email);
      },
    },
    fields: {
      label: "Fields",
      description: "Optional fields for a subscriber in JSON format",
      type: "string[]",
      optional: true,
    },
    origin: {
      label: "Origin Header",
      description: "Value for the X-Doppler-Subscriber-Origin header",
      type: "string",
      optional: true,
    },
    name: {
      label: "Subscriber Name",
      description: "Optional name of the subscriber",
      type: "string",
      optional: true,
    },
    country: {
      label: "Country",
      description: "Optional country of the subscriber",
      type: "string",
      optional: true,
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
      $ = this, method = "GET", path = "/", data, params, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._apiUrl()}${path}`,
        data,
        params,
        headers: {
          ...headers,
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
    async getSubscribers({
      listId, ...args
    }) {
      const extraPath = listId
        ? `/lists/${listId}`
        : "";
      return this._makeRequest({
        path: `${extraPath}/subscribers`,
        ...args,
      });
    },
    async addOrUpdateSubscriber({
      email, fields = [], name, country, origin, ...args
    }) {
      const subscriberData = {
        email,
        fields: [
          ...fields.map((field) => JSON.parse(field)),
          {
            name: fields.name || name,
          },
          {
            country: fields.country || country,
          },
        ].filter((field) => Object.values(field).some((value) => value)),
      };
      return this._makeRequest({
        path: "/subscribers",
        method: "POST",
        headers: {
          "X-Doppler-Subscriber-Origin": origin,
        },
        data: subscriberData,
        ...args,
      });
    },
    async unsubscribeSubscriber({
      email, ...args
    }) {
      return this._makeRequest({
        path: "/unsubscribed",
        method: "POST",
        data: {
          subscriber: {
            email,
          },
        },
        ...args,
      });
    },
    async removeSubscriber({
      email, listId, ...args
    }) {
      return this._makeRequest({
        path: `/lists/${listId}/subscribers/${email}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
