import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dear",
  methods: {
    async makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        ...configProps
      } = customConfig;

      const {
        account_id: accountId,
        application_key: applicationKey,
      } = this.$auth;

      const headers = {
        ...configProps?.headers,
        "Content-type": "application/json",
        [constants.API_AUTH_ACCOUNT_ID_HEADER]: accountId,
        [constants.API_AUTH_APPLICATION_KEY_HEADER]: applicationKey,
      };

      const config = {
        ...configProps,
        headers,
        url: url ?? `${constants.BASE_URL}${constants.VERSION_PATH}${path}`,
        timeout: 10000,
      };

      return axios($ ?? this, config);
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
      $, params,
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: "/webhooks",
        params,
      });
    },
    async listProducts({
      $, params,
    }) {
      return this.makeRequest({
        $,
        method: "get",
        path: "/Product",
        params,
      });
    },
  },
};
