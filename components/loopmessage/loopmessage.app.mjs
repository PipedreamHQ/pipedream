import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "loopmessage",
  propDefinitions: {
    contact: {
      type: "string",
      label: "Contact",
      description: "Recipient phone number or email address.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Message text.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Optional. Message subject. A recipient will see this subject as a bold title before the text. For iMessage only.",
      optional: true,
    },
    effect: {
      type: "string",
      label: "Effect",
      description: "Optional. Add effect to your message. For iMessage only.",
      options: constants.EFFECTS,
      optional: true,
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "Optional. Use a specific Sender Name for outbound message.",
      optional: true,
      async options() {
        const response = await this.makeRequest({
          method: "get",
          path: "/integrations/pipedream/sender-name-list/",
        });

        return response.map((item) => ({
          label: item.label,
          value: item.value,
        }));
      },
    },
    replyToId: {
      type: "string",
      label: "Reply To ID",
      description: "Optional. Reply to a message with a specific ID",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      optional: true,
      description: "Optional. You can choose which service to use to deliver the message. By default, the required channel will be determined automatically.\nUse this parameter only in cases when you need to override the delivery channel for a specific request. DON'T use it as a default parameter for all requests.",
      options: constants.SERVICES,
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "Voice/Media file URL. The string must be a full URL of your audio file. URL should start with https://..., http links (without SSL) are not supported. This must be a publicly accessible URL: we will not be able to reach any URLs that are hidden or that require authentication. Max length of each URL: 256 characters. Audio files of the following formats are supported: mp3, wav, m4a, caf, aac.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message.",
    },
    passthrough: {
      type: "string",
      label: "Passthrough",
      description: "Optional. A string of metadata you wish to store in this request. Max length: 1000 characters.",
      optional: true,
    },
    typing: {
      type: "integer",
      label: "Typing",
      description: "Typing duration in seconds.",
      default: 3,
    },
    read: {
      type: "boolean",
      label: "Read",
      description: "Mark message as read.",
      default: true,
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Authorization": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, ...args
    } = {}) {
      return axios(step, {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this.post({
        path: "/integrations/pipedream/message/send/",
        ...args,
      });
    },
    updatePipedreamWebhook(webhookUrl, args = {}) {
      return this.post({
        path: "/integrations/pipedream/update-pipedream-webhook/",
        data: {
          webhook_url: webhookUrl,
        },
        ...args,
      }).catch((error) => {
        if (error.response?.status === 400) {
          const data = error.response.data;
          const message =
              typeof data === "string"
                ? data
                : data?.message ?? data?.error ?? data?.detail ?? JSON.stringify(data);
          throw new Error(message);
        }

        throw error;
      });
    },
    deactivatePipedreamWebhook(webhookUrl, args = {}) {
      return this.delete({
        path: "/integrations/pipedream/update-pipedream-webhook/",
        data: {
          webhook_url: webhookUrl,
        },
        ...args,
      }).catch((error) => {
        if (error.response?.status === 400) {
          const data = error.response.data;
          const message =
              typeof data === "string"
                ? data
                : data?.message ?? data?.error ?? data?.detail ?? JSON.stringify(data);
          throw new Error(message);
        }

        throw error;
      });
    },
    sendReaction(args = {}) {
      return this.post({
        path: "/integrations/pipedream/reaction/",
        ...args,
      });
    },
    sendTyping(args = {}) {
      return this.post({
        path: "/integrations/pipedream/typing/",
        ...args,
      });
    },
    getMessageStatus(messageId, args = {}) {
      return this.makeRequest({
        method: "get",
        path: `/integrations/pipedream/message/status/${messageId}/`,
        ...args,
      });
    },
  },
};
