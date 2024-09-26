import { defineApp } from "@pipedream/types";
import constants from "../common/constants.js";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "dialpad",
  propDefinitions: {
    contactType: {
      type: "string",
      label: "Contact type",
      description: "The contact type this event subscription subscribes to.",
      options: constants.CONTACT_EVENT_TYPE,
    },
    callStates: {
      type: "string",
      label: "Call States",
      description: "The call event subscription's list of call states.",
      options: constants.CALL_STATES,
    },
  },
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
        path: `/webhooks/${ids.webhookId}`,
        method: "delete",
      });
      await this.removeEventWebHook(path, ids.eventId);
    },
    removeEventWebHook(path, eventId) {
      return this._makeRequest({
        path: `${path}/${eventId}`,
        method: "delete",
      });
    },
  },
});
