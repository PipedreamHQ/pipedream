import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "46elks",
  version: "0.0.{{ts}}",
  propDefinitions: {
    number: {
      type: "string",
      label: "Phone Number",
      description: "The phone number linked to your 46elks account that will receive SMS messages",
    },
    from: {
      type: "string",
      label: "From Phone Number",
      description: "The phone number initiating the call or sending the SMS message",
    },
    to: {
      type: "string",
      label: "To Phone Number",
      description: "The phone number receiving the call or SMS message",
    },
    message: {
      type: "string",
      label: "Message Text",
      description: "The text of the SMS message to send",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.46elks.com/a1";
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
          "Authorization": `Basic ${Buffer.from(`${this.$auth.username}:${this.$auth.password}`).toString("base64")}`,
        },
      });
    },
    async sendSms({
      from, to, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/SMS",
        data: {
          from,
          to,
          message,
        },
      });
    },
    async dialNumbers({
      from, to,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/Calls",
        data: {
          from,
          to,
          action: "connect",
        },
      });
    },
    async getAccountDetails() {
      return this._makeRequest({
        path: "/Me",
      });
    },
    async updateAccountDetails({
      name, email,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/Me",
        data: {
          name,
          email,
        },
      });
    },
  },
};
