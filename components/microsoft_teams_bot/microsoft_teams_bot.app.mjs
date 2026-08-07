import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "microsoft_teams_bot",
  propDefinitions: {
    baseUrl: {
      type: "string",
      label: "Service URL",
      description: "The Teams service endpoint URL from the incoming message. Required for routing responses back to the correct Teams instance, e.g. `event.body.serviceUrl`.",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "Unique identifier for the Teams conversation (can be a 1:1 chat, group chat, or channel conversation). Required to send messages to the correct conversation thread. e.g. `event.body.conversation.id`.",
    },
    fromId: {
      type: "string",
      label: "From ID",
      description: "The ID of the sender, e.g. `event.body.from.id`.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The name of the sender, e.g. `event.body.from.name`.",
    },
    toId: {
      type: "string",
      label: "Recipient ID",
      description: "The ID of the recipient, e.g. `event.body.recipient.id`.",
    },
    toName: {
      type: "string",
      label: "Recipient Name",
      description: "The name of the recipient, e.g. `event.body.recipient.name`.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The actual message content to send to Teams. Can include plain text, Markdown, or HTML depending on your formatting needs.",
    },
  },
  methods: {
    sanitizeBaseUrl(baseUrl) {
      return baseUrl.endsWith("/")
        ? baseUrl
        : `${baseUrl}/`;
    },
    getUrl(baseUrl, path) {
      return `${this.sanitizeBaseUrl(baseUrl)}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    makeRequest({
      $ = this, baseUrl, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(baseUrl, path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
