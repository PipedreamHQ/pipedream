import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kwtsms",
  propDefinitions: {
    recipientNumber: {
      type: "string",
      label: "Recipient Number",
      description: "The telephone number of the recipient.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the SMS message to send.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.kwtsms.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method,
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async sendSms({
      recipientNumber, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/send_sms",
        data: {
          recipient: recipientNumber,
          message: messageContent,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
