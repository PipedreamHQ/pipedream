import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "unisender",
  propDefinitions: {
    contact: {
      type: "string",
      label: "Contact",
      description: "Email or phone number that needs be unsubscribed from campaigns.",
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The type of the contact to be unsubscribed.",
      options: [
        "email",
        "phone",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email. There must be at least the `email` or `phone` field, otherwise the method will return an error.",
    },
    lists: {
      type: "string[]",
      label: "Lists",
      description: "Lists in which the contact will be added.",
      async options({ $ }) {
        const { result: lists } = await this.getLists({
          $,
        });

        return lists.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact's name.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone. There must be at least the «email» or «phone» field, otherwise the method will return an error. Pay attention this field value should be passed in the international phone number format (e.g. +79261232323)",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags that are added to the contact. Allowed number of tags is 10.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.unisender.com/en/api";
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getParams(params) {
      return {
        api_key: this._apiKey(),
        format: "json",
        ...params,
      };
    },
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        params: this._getParams(params),
        ...opts,
      };

      return axios($, config);
    },
    getLists({ $ }) {
      return this._makeRequest({
        $,
        path: "getLists",
      });
    },
    removeHook(opts) {
      return this._makeRequest({
        ...opts,
        path: "removeHook",
      });
    },
    setHook(opts) {
      return this._makeRequest({
        ...opts,
        path: "setHook",
      });
    },
    subscribeContact({
      $, ...args
    }) {
      return this._makeRequest({
        $,
        path: "subscribe",
        ...args,
      });
    },
    unsubscribeContact({
      $, ...args
    }) {
      return this._makeRequest({
        $,
        path: "unsubscribe",
        ...args,
      });
    },
  },
};
