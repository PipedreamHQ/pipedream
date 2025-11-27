import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendblue",
  propDefinitions: {
    fromNumber: {
      type: "string",
      label: "Origin Phone Number",
      description: "The phone number to send from. Must be one of your registered **Sendblue** phone numbers in E.164 format. Without this parameter, the message will fail to send.",
    },
    toNumber: {
      type: "string",
      label: "Recipient Phone Number",
      description: "The phone number of the recipient in E.164 format (e.g., `+12025551234`)",
    },
    content: {
      type: "string",
      label: "Message Content",
      description: "The text content of the message to send",
      optional: true,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "URL of media file to send (images, videos, etc.)",
      optional: true,
    },
    sendStyle: {
      type: "string",
      label: "Send Style",
      description: "The iMessage expressive message style (iMessage only)",
      optional: true,
      options: [
        "celebration",
        "shooting_star",
        "lasers",
        "love",
        "confetti",
        "balloons",
        "spotlight",
        "echo",
        "invisible",
        "gentle",
        "loud",
        "slam",
        "fireworks",
      ],
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the iMessage group to send the message to",
      optional: true,
    },
    statusCallback: {
      type: "string",
      label: "Status Callback",
      description: "Webhook URL for message status updates",
      optional: true,
    },
    accountEmail: {
      type: "string",
      label: "Account Email",
      description: "Filter by account email",
      optional: true,
    },
    fromNumberFilter: {
      type: "string",
      label: "From Number",
      description: "Filter by sender phone number",
      optional: true,
    },
    toNumberFilter: {
      type: "string",
      label: "To Number",
      description: "Filter by recipient phone number",
      optional: true,
    },
    groupIdFilter: {
      type: "string",
      label: "Group ID",
      description: "Filter by group ID",
      optional: true,
    },
    messageTypeFilter: {
      type: "string",
      label: "Message Type",
      description: "Filter by message type",
      optional: true,
      options: [
        {
          label: "Direct Message",
          value: "message",
        },
        {
          label: "Group Message",
          value: "group",
        },
      ],
    },
    serviceFilter: {
      type: "string",
      label: "Service Type",
      description: "Filter by service type",
      optional: true,
      options: [
        {
          label: "iMessage",
          value: "iMessage",
        },
        {
          label: "SMS",
          value: "SMS",
        },
      ],
    },
    statusFilter: {
      type: "string",
      label: "Status",
      description: "Filter by message status",
      optional: true,
      options: [
        "REGISTERED",
        "PENDING",
        "SENT",
        "DELIVERED",
        "RECEIVED",
        "QUEUED",
        "ERROR",
        "DECLINED",
        "ACCEPTED",
        "SUCCESS",
      ],
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Field to order messages by",
      optional: true,
      options: [
        {
          label: "Created At",
          value: "createdAt",
        },
        {
          label: "Updated At",
          value: "updatedAt",
        },
        {
          label: "Sent At",
          value: "sentAt",
        },
      ],
    },
    orderDirection: {
      type: "string",
      label: "Order Direction",
      description: "Sort order",
      optional: true,
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to return (1-1000)",
      optional: true,
      default: 50,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.sendblue.co${path}`;
    },
    getHeaders() {
      const {
        api_key: apiKey,
        api_secret: apiSecret,
      } = this.$auth;

      return {
        "Content-Type": "application/json",
        "sb-api-key-id": apiKey,
        "sb-api-secret-key": apiSecret,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    } = {}) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(),
        ...otherOpts,
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "post",
      });
    },
    sendMessage(opts = {}) {
      return this.post({
        path: "/api/send-message",
        ...opts,
      });
    },
    sendGroupMessage(opts = {}) {
      return this.post({
        path: "/api/send-group-message",
        ...opts,
      });
    },
    getContactList(opts = {}) {
      return this._makeRequest({
        path: "/api/v2/contacts",
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/api/v2/messages",
        ...opts,
      });
    },
    addWebhook(opts = {}) {
      return this.post({
        path: "/api/v2/account/webhooks",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "delete",
        path: "/api/v2/account/webhooks",
      });
    },
  },
};
