import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "loopmessage",
  auth: {
    type: "custom",
    props: {
      auth: {
        type: "custom",
        props: {
          api_key: {
            type: "string",
            label: "Authorization",
            secret: true,
          },
        },
      },
    },
  },
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
    sender: {
      type: "string",
      label: "Sender",
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
    subject: {
      type: "string",
      label: "Subject",
      description: "Message subject. A recipient will see this subject as a bold title before the text. For iMessage only.",
      optional: true,
    },
    effect: {
      type: "string",
      label: "Effect",
      description: "Optional. Optional. Add effect to your message. For iMessage only.",
      options: constants.EFFECTS,
      optional: true,
    },
    replyToId: {
      type: "string",
      label: "Reply To ID",
      description: "Reply to a message with a specific ID",
      optional: true,
    },
    passthrough: {
      type: "string",
      label: "Passthrough",
      description: "Optional. A string of metadata you wish to store with the checkout. Will be sent alongside all webhooks associated with the outbound message. Max length: 1000 characters.о",
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
      optional: true,
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID of the message.",
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
        Authorization: this.$auth.api_key,
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
    sendMessage(args = {}) {
      return this.post({
        path: "/integrations/pipedream/message/send/",
        ...args,
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
