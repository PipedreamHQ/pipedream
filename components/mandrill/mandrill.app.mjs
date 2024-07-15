import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mandrill",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://mandrillapp.com/api/1.0";
    },
    _makeRequest({
      $ = this,
      path,
      data,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        data: {
          ...data,
          key: this.$auth.api_key,
        },
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/send.json",
        ...args,
      });
    },
  },
};
