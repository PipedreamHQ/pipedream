import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default defineApp({
  type: "app",
  app: "twitch_developer_app",
  propDefinitions: {
    streamerLoginNames: {
      type: "string[]",
      label: "Streamer Login Names",
      description: "Enter the login names of the streamers whose streams you want to watch.",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.twitch.tv/helix";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "client-id": this.$auth.client_id,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(method:string, endpoint:string, options = {}, $ = this) {
      const config = {
        method,
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(),
        ...options,
      };
      return axios($, config);
    },
    async getUsers(login = []) {
      const endpoint = "users";
      const params = {
        login,
      };
      return await this._makeRequest("GET", encodeURI(endpoint), {
        params,
      });
    },
    async createWebHook(type:string, condition = {}, url:string, secretToken:string) {
      const endpoint = "eventsub/subscriptions";
      const data = {
        "type": type,
        "version": "1",
        "condition": condition,
        "transport": {
          "method": "webhook",
          "callback": url,
          "secret": secretToken,
        },
      };
      return await this._makeRequest("POST", endpoint, {
        data,
      });
    },
    async getWebHooks(url:string) {
      const endpoint = "eventsub/subscriptions";
      let allWebHooks = (await this._makeRequest("GET", endpoint)).data;
      return allWebHooks.filter((item: { transport: { callback: string; }; }) => item.transport.callback === url);
    },
    verifyWebhookRequest(message:string, secretToken:string, verifySignature:string) {
      const HMAC_PREFIX = "sha256=";
      const hmac = HMAC_PREFIX + crypto.createHmac("sha256", secretToken)
        .update(message)
        .digest("hex");
      return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
    },
    async deleteEventSub(subID:string) {
      let endpoint = "eventsub/subscriptions";
      const data = {
        "id": subID,
      };
      return await this._makeRequest("DELETE", endpoint, {
        data,
      });
    },
  },
});
