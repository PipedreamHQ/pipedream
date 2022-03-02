import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ip2location",
  description: "Query IP address using IP2Location API. You can sign up for a trial key at [here](https://www.ip2location.com/register?id=1005).",
  propDefinitions: {},
  methods: {
    async queryIPInfo(customConfig) {
      const {
        $,
        params,
      } = customConfig;

      const config = {
        url: "https://api.ip2location.com/v2/",
        params: {
          key: `${this.ip2location_api_key.$auth.api_key}`,
          ...params,
        },
      };

      return axios($, config);
    },
  },
};
