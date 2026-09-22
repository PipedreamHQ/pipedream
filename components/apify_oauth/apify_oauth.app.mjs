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
    getAuthToken() {
      return this.$auth.oauth_access_token;
    },
    _client() {
      return new ApifyClient({
        token: this.getAuthToken(),
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
