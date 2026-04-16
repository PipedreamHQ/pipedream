import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "signal",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Your registered Signal phone number (e.g. `+14151234567`).",
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "One or more phone numbers, usernames, or group IDs to send the message to.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message text to send.",
    },
    textMode: {
      type: "string",
      label: "Text Mode",
      description: "Set to `styled` to enable formatting: *italic*, **bold**, ~strikethrough~, ||spoiler||, `monospace`.",
      options: [
        "normal",
        "styled",
      ],
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Receive Timeout",
      description: "Timeout in seconds when receiving messages from the Signal network.",
      optional: true,
    },
    ignoreAttachments: {
      type: "boolean",
      label: "Ignore Attachments",
      description: "If enabled, attachments will not be downloaded when receiving messages.",
      optional: true,
    },
    ignoreStories: {
      type: "boolean",
      label: "Ignore Stories",
      description: "If enabled, story messages will be ignored when receiving messages.",
      optional: true,
    },
    sendReadReceipts: {
      type: "boolean",
      label: "Send Read Receipts",
      description: "If enabled, read receipts will automatically be sent for received messages.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.api_url}${path}`;
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path),
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/send",
        ...args,
      });
    },
    receiveMessages({
      phoneNumber, ...args
    } = {}) {
      return this._makeRequest({
        path: `/v1/receive/${encodeURIComponent(phoneNumber)}`,
        ...args,
      });
    },
  },
};
