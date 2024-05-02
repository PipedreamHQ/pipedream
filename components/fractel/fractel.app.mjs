import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fractel",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to call or send the message to, including country code.",
    },
    to: {
      type: "string",
      label: "To",
      description: "The recipient phone number, including country code.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message content for SMS or MMS.",
    },
    media: {
      type: "string",
      label: "Media URL",
      description: "The URL of the media file for MMS.",
      optional: true,
    },
    confirmationUrl: {
      type: "string",
      label: "Confirmation URL",
      description: "The URL to receive message delivery confirmations.",
      optional: true,
    },
    confirmationUrlUsername: {
      type: "string",
      label: "Confirmation URL Username",
      description: "The username for HTTP Basic authentication for the confirmation URL.",
      optional: true,
    },
    confirmationUrlPassword: {
      type: "string",
      label: "Confirmation URL Password",
      description: "The password for HTTP Basic authentication for the confirmation URL.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fonestorm.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async initiateCall({
      phoneNumber, to, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/calls",
        data: {
          from: phoneNumber,
          to,
          message,
        },
      });
    },
    async sendMessage({
      to, message, media, confirmationUrl, confirmationUrlUsername, confirmationUrlPassword,
    }) {
      const data = {
        to,
        message,
      };
      if (media) data.media = media;
      if (confirmationUrl) {
        data.confirmation_url = confirmationUrl;
        if (confirmationUrlUsername) data.confirmation_url_username = confirmationUrlUsername;
        if (confirmationUrlPassword) data.confirmation_url_password = confirmationUrlPassword;
      }
      return this._makeRequest({
        method: "POST",
        path: "/messages/send",
        data,
      });
    },
  },
};
