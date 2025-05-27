import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "syncmate_by_assitro",
  propDefinitions: {
    number: {
      type: "string",
      label: "Number",
      description: "WhatsApp number with country code",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text message to be sent",
    },
    media: {
      type: "string[]",
      label: "Media",
      description: "Base64 encoded media files",
      optional: true,
      default: [],
    },
    numberOfMessages: {
      type: "integer",
      label: "Number of Messages",
      description: "The number of messages to send in bulk",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.assistro.co/api/v1/wapushplus";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },
    async sendSingleMessage({
      number, message, media = [],
    }) {
      const data = {
        msgs: [
          {
            number,
            message,
            media: media.map((m) => ({
              media_base64: m,
              file_name: `file_${Date.now()}`,
            })),
          },
        ],
      };
      return this._makeRequest({
        path: "/single/message",
        data,
      });
    },
    async sendBulkMessages({
      numberOfMessages, number, message, media = [],
    }) {
      const msgs = Array.from({
        length: numberOfMessages,
      }, () => ({
        number,
        message,
        media: media.map((m) => ({
          media_base64: m,
          file_name: `file_${Date.now()}`,
        })),
      }));
      const data = {
        msgs,
      };
      return this._makeRequest({
        path: "/bulk/message",
        data,
      });
    },
  },
};
