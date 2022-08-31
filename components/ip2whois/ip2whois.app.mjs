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
          key: `${this.$auth.api_key}`,
          source: 'pipedream',
          source_version: '1.0.0',
          ...params,
        },
      };

      return axios($, config);
    },
  },
};
