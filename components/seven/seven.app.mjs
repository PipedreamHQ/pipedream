import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "seven",
  propDefinitions: {
    number: {
      type: "string",
      label: "Number",
      description: "The phone number to look up. (e.g. `49176123456789`)",
    },
    to: {
      type: "string",
      label: "To",
      description: "The destination phone number. Accepts all common formats like `0049171123456789`, `49171123456789`, `+49171123456789`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://gateway.seven.io/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    lookupCnam(opts = {}) {
      return this._makeRequest({
        path: "/lookup/cnam",
        ...opts,
      });
    },
    lookupFormat(opts = {}) {
      return this._makeRequest({
        path: "/lookup/format",
        ...opts,
      });
    },
    lookupHlr(opts = {}) {
      return this._makeRequest({
        path: "/lookup/hlr",
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms",
        ...opts,
      });
    },
    sendTtsCall(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/voice",
        ...opts,
      });
    },
  },
};
