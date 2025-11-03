import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "topmessage",
  propDefinitions: {
    from: {
      type: "string",
      label: "From",
      description: "The name your message will appear to be sent from. You can customize it with your company name (up to 11 characters) or use a virtual number",
    },
    to: {
      type: "string[]",
      label: "To",
      description: "The recipient's mobile phone number(s) in international format",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Your message text to be sent to the recipient(s)",
    },
    shortenURLs: {
      type: "boolean",
      label: "Shorten URLs",
      description: "Indicates whether HTTPS URLs in the text should be replaced with shortened URLs",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "Unique identifier of your sent template. You can check the available templates or create a new one from your account in the templates page",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The communication channel your message will be sent through",
      options: constants.CHANNEL_OPTIONS,
      optional: true,
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "Specifies the time when the message should be sent, i.e.: `2024-12-01T18:00:00Z`. The scheduled time cannot be set for more than 1 year in the future",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.topmessage.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "x-topmessage-key": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },

    async sendMessage(args = {}) {
      return this._makeRequest({
        path: "/messages",
        method: "POST",
        ...args,
      });
    },
  },
};
