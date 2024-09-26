import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fractel",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to call to, including country code.",
      async options() {
        const { fonenumbers } = await this.listFoneNumbers();
        return fonenumbers;
      },
    },
    to: {
      type: "string",
      label: "To",
      description: "The recipient phone number, including country code.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message content for TTS.",
    },
    media: {
      type: "string",
      label: "Media URL",
      description: "Media URL of the media file for MMS.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fonestorm.com/v2";
    },
    _headers() {
      return {
        token: `${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    initiateCall(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/calls",
        ...opts,
      });
    },
    listFoneNumbers(opts = {}) {
      return this._makeRequest({
        path: "/fonenumbers",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/send",
        ...opts,
      });
    },
  },
};
