import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "membado",
  propDefinitions: {},
  methods: {
    _baseRequest({
      $, data, headers, ...args
    }) {
      return axios($, {
        baseURL: `https://www.membado.io/api/${this.$auth.user_identifier}`,
        data: {
          ...data,
          apikey: this.$auth.api_key,
        },
        headers: {
          ...headers,
          "content-type": "application/x-www-form-urlencoded",
        },
        ...args,
      });
    },
    addMember(args) {
      return this._baseRequest({
        method: "POST",
        url: "/add-member",
        ...args,
      });
    },
  },
};
