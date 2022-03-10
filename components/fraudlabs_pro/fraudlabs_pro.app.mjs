import fraudlabspro from "fraudlabspro-nodejs";

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
      return new Promise((resolve, reject) => {
        this.smsVerification().sendSMS(params, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    },
    async verifyOtp(params) {
      return new Promise((resolve, reject) => {
        this.smsVerification().verifyOTP(params, (err, data) => {
          if (err) {
            reject(data);
          }
          resolve(data);
        });
      });
    },
  },
};
