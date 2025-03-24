import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "doppler_marketing_automation",
  propDefinitions: {
    listId: {
      label: "List ID",
      description: "The list ID",
      type: "string",
      async options({ page }) {
        const { items } = await this.listLists({
          params: {
            page: page + 1,
          },
        });
        return items.map(({
          listId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subscriberEmail: {
      label: "Subscriber Email",
      description: "The subscriber email",
      type: "string",
      async options({
        page, listId, filter = () => true,
      }) {
        const { items } = await this.listSubscribers({
          listId,
          params: {
            page: page + 1,
          },
        });
        return items.filter(filter).map(({ email }) => email);
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
  },
  methods: {
    _baseUrl() {
      return `https://restapi.fromdoppler.com/accounts/${this.$auth.account_name}`;
    },
    _headers() {
      return {
        "Authorization": `token ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    listSubscribers({
      listId = null, ...opts
    }) {
      return this._makeRequest({
        path: `${listId
          ? `/lists/${listId}`
          : ""}/subscribers`,
        ...opts,
      });
    },
    getSubscriber({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/subscribers/${email}`,
        ...args,
      });
    },
    addOrUpdateSubscriber({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/subscribers`,
        ...opts,
      });
    },
    unsubscribeSubscriber(opts = {}) {
      return this._makeRequest({
        path: "/unsubscribed",
        method: "POST",
        ...opts,
      });
    },
    removeSubscriber({
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
