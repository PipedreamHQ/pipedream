import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ip2proxy",
  propDefinitions: {},
  methods: {
    async queryIPInfo(customConfig) {
      const {
        $,
        params,
      } = customConfig;

      const config = {
        url: "https://api.ip2proxy.com/",
        params: {
          key: `${this.$auth.api_key}`,
          ...params,
        },
      };

      return axios($, config);
    },
  },
};
