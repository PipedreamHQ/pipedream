import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "veriphone",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number you wish to verify",
    },
    defaultCountry: {
      type: "string",
      label: "Default Country",
      description: "The default country code",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country for the dummy phone number",
    },
    phoneType: {
      type: "string",
      label: "Phone Type",
      description: "The type of phone number (e.g., mobile, fixed_line, voip)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.veriphone.io/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
        headers: {
          ...headers,
        },
      });
    },
    async verifyPhoneNumber({
      phoneNumber, defaultCountry,
    }) {
      return this._makeRequest({
        path: "/verify",
        params: {
          phone: phoneNumber,
          default_country: defaultCountry,
        },
      });
    },
    async getDummyPhoneNumber({
      country, phoneType,
    }) {
      return this._makeRequest({
        path: "/example",
        params: {
          country_code: country,
          type: phoneType,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
