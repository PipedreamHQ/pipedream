import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sms_fusion",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to send the message to in MSISDN format. Example: `61412345678`",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "A 2 character country code ISO 3166-2 for formatting local numbers internationally",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "http://api.smsfusion.com.au";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
        },
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getBalance(opts = {}) {
      return this._makeRequest({
        path: "/balance/",
        ...opts,
      });
    },
    hlrLookup(opts = {}) {
      return this._makeRequest({
        path: "/hlr/",
        ...opts,
      });
    },
    sendSMS(opts = {}) {
      return this._makeRequest({
        path: "/sms/",
        ...opts,
      });
    },
  },
};
