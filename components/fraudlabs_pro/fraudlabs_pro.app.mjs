import fraudlabspro from "fraudlabspro-nodejs";
import { promisify } from "util";

export default {
  type: "app",
  app: "fraudlabs_pro",
  propDefinitions: {
    format: {
      type: "string",
      label: "Result Format",
      description: "*(optional)* Format of the result. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
  },
  methods: {
    smsVerification() {
      return new fraudlabspro.SMSVerification(this.$auth.api_key);
    },
    async sendSmsVerification(params) {
      const promise = promisify(this.smsVerification().sendSMS);
      return promise(params);
    },
    async verifyOtp(params) {
      const promise = promisify(this.smsVerification().verifyOTP);
      return promise(params);
    },
  },
};