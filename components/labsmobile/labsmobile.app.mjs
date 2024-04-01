import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "labsmobile",
  propDefinitions: {
    to: {
      type: "string",
      label: "Recipient's Phone Number",
      description: "The phone number of the recipient. Include the country code without '+' or '00'.",
    },
    message: {
      type: "string",
      label: "SMS Text",
      description: "The text message to send. Maximum message length is 160 characters for standard GSM characters.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.labsmobile.com/json";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/send",
        data,
        headers,
        ...otherOpts
      } = opts;

      const authHeader = `Basic ${Buffer.from(`${this.$auth.username}:${this.$auth.password}`).toString("base64")}`;

      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "Cache-Control": "no-cache",
        },
        data,
      });
    },
    async sendSMS({
      to, message,
    }) {
      return this._makeRequest({
        data: {
          message,
          recipient: [
            {
              msisdn: to,
            },
          ],
        },
      });
    },
  },
};
