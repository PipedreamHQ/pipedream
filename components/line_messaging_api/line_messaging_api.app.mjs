import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "line_messaging_api",
  propDefinitions: {
    message: {
      label: "Message Text",
      type: "string",
      description: "The text of message to send",
    },
    notificationDisabled: {
      label: "Disable Notification",
      type: "boolean",
      description: "The user will receive a push notification when the message is sent",
      default: false,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.line.me/v2/bot";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.long_lived_channel_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/channel/webhook/endpoint",
        method: "PUT",
        ...opts,
      });
    },
    getWebhook(opts = {}) {
      return this._makeRequest({
        path: "/channel/webhook/endpoint",
        ...opts,
      });
    },
    sendPushMessage(opts = {}) {
      return this._makeRequest({
        path: "/message/push",
        method: "POST",
        ...opts,
      });
    },
    sendReplyMessage(opts = {}) {
      return this._makeRequest({
        path: "/message/reply",
        method: "POST",
        ...opts,
      });
    },
    sendMulticastMessage(opts = {}) {
      return this._makeRequest({
        path: "/message/multicast",
        method: "POST",
        ...opts,
      });
    },
    sendBroadcastMessage(opts = {}) {
      return this._makeRequest({
        path: "/message/broadcast",
        method: "POST",
        ...opts,
      });
    },
  },
};
