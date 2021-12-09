import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "zendesk",
  propDefinitions: {},
  methods: {
    getApiUrl({
      path, subdomain,
    }) {
      const {
        SUBDOMAIN_PLACEHOLDER,
        BASE_URL,
        VERSION_PATH,
      } = constants;
      return `${BASE_URL.replace(SUBDOMAIN_PLACEHOLDER, subdomain)}${VERSION_PATH}${path}`;
    },
    async makeRequest(customConfig) {
      const {
        oauth_access_token: oauthAccessToken,
        subdomain,
      } = this.$auth;

      const {
        $,
        path,
        ...configProps
      } = customConfig;

      const url = this.getApiUrl({
        subdomain,
        path,
      });

      const authorization = `Bearer ${oauthAccessToken}`;

      const headers = {
        ...configProps?.headers,
        authorization,
      };

      const config = {
        ...configProps,
        headers,
        url,
        timeout: 10000,
      };

      return await axios($ ?? this, config);
    },
    async createWebhook({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/webhooks",
        data,
      });
    },
    async deleteWebhook({
      $, webhookId,
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
