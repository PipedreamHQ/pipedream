import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ip2whois",
  description: "WHOIS lookup API license key. You can sign up for a free license key at [here](https://ip2whois.com/register).",
  propDefinitions: {},
  methods: {
    async queryDomainInfo(customConfig) {
      const {
        $,
        params,
      } = customConfig;

      const config = {
        url: "https://api.ip2whois.com/v2/",
        params: {
          key: `${this.ip2whois_api_key.$auth.api_key}`,
          ...params,
        },
      };

      return axios($, config);
    },
  },
};
