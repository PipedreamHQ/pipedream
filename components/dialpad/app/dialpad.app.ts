import { defineApp } from "@pipedream/types";
import constants from "../common/constants.js";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "dialpad",
  propDefinitions: {},
  methods: {
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getUrl(path) {
      const {
        BASE_URL,
        HTTP_PROTOCOL,
        VERSION_PATH,
      } = constants;
      return `${HTTP_PROTOCOL}${BASE_URL}${VERSION_PATH}${path}`;
    },
    async _makeRequest(args) {
      const {
        $,
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
        data,
      };
      return axios($ ?? this, config);
    },
    async createWebhook({
      path, hook_url, data,
    }) {
      // get webhook ID
      const webhook = await this._makeRequest({
        path: "/webhooks",
        method: "post",
        data: {
          hook_url,
        },
      });

      // Create webhook event with the webhook ID generated above
      const event = await this._makeRequest({
        path,
        method: "post",
        data: {
          webhook_id: webhook.id,
          enabled: true,
          ...data,
        },
      });

      return {
        webhookId: webhook.id,
        eventId: event.id,
      };
    },
    async removeWebhook({
      path, ids,
    }) {
      await this._makeRequest({
        path: `${path}/${ids.eventId}`,
        method: "delete",
      });
      await this._makeRequest({
        path: `/webhooks/${ids.webhookId}`,
        method: "delete",
      });
    },
  },
});
