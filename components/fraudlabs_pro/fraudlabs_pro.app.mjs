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
    fraudValidation() {
      return new fraudlabspro.FraudValidation(this.$auth.api_key);
    },
    smsVerification() {
      return new fraudlabspro.SMSVerification(this.$auth.api_key);
    },
    async feedbackOrder(params) {
      const promise = promisify(this.fraudValidation().feedback);
      return promise(params);
    },
    async screenOrder(params) {
      const promise = promisify(this.fraudValidation().validate);
      return promise(params);
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
