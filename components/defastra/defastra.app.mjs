import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "defastra",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to perform the risk analysis on.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to conduct the risk assessment and digital lookup for, in international format.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.defastra.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        data,
        params,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
          "Content-Type": "application/x-www-form-urlencoded",
          ...otherOpts.headers,
        },
      });
    },
    async performEmailRiskAnalysis({ email }) {
      const params = new URLSearchParams();
      params.append("email", email);
      return this._makeRequest({
        path: "/deep_email_check",
        data: params,
      });
    },
    async performPhoneRiskAnalysis({ phoneNumber }) {
      const params = new URLSearchParams();
      params.append("phone", phoneNumber);
      return this._makeRequest({
        path: "/deep_phone_check",
        data: params,
      });
    },
  },
};
