import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tremendous",
  propDefinitions: {},
  methods: {
    _baseRequest({
      $, headers, ...args
    }) {
      return axios($, {
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        baseURL: "https://testflight.tremendous.com/api/v2",
        ...args,
      });
    },
  },
};
