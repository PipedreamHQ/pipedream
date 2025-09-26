import common from "@pipedream/apify";
import { ApifyClient } from "apify-client";

export default {
  type: "app",
  app: "apify_oauth",
  propDefinitions: {
    ...common.propDefinitions,
  },
  methods: {
    ...common.methods,
    _client() {
      return new ApifyClient({
        token: this.$auth.oauth_access_token,
        requestInterceptors: [
          (config) => ({
            ...config,
            headers: {
              ...(config.headers || {}),
              "x-apify-integration-platform": "pipedream",
            },
          }),
        ],
      });
    },
  },
};
