import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "callerapi",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to retrieve information for (E.164 format, e.g., +18006927753)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://callerapi.com/api/phone";
    },
    _headers() {
      return {
        "x-auth": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, method, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        method,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    getPhoneInfo({
      $, phoneNumber,
    }) {
      return this._makeRequest({
        $,
        path: `/info/${phoneNumber}`,
      });
    },
    getPhonePicture({
      $, phoneNumber,
    }) {
      return this._makeRequest({
        $,
        path: `/pic/${phoneNumber}`,
      });
    },
  },
};
