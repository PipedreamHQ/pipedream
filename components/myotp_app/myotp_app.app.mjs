import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "myotp_app",
  propDefinitions: {
    otpValidity: {
      type: "integer",
      label: "OTP Validity",
      description: "Validity of the OTP",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number to which the OTP will be sent",
    },
    messageID: {
      type: "string",
      label: "Message ID",
      description: "ID of the OTP message",
      async options() {
        const response = await this.getReport({});
        const messagesIDs = response.transactions;
        return messagesIDs.map(({
          message_id, phone_number,
        }) => ({
          value: message_id,
          label: phone_number,
        }));
      },
    },
    otp: {
      type: "string",
      label: "OTP",
      description: "One-time password sent to the phone number",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.myotp.app";
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
          ...headers,
          "X-API-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async sendOTP(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/generate_otp",
        ...args,
      });
    },
    async verifyOTP(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/verify_otp",
        ...args,
      });
    },
    async getReport(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/report",
        ...args,
      });
    },
  },
};
