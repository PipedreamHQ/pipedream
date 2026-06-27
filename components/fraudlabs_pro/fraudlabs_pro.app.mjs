import { axios } from "@pipedream/platform";
import {
  API_BASE_URL, API_VERSION,
} from "./common/constants.mjs";

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
    sendSmsVerification(args = {}) {
      return this._post({
        path: "/verification/send",
        ...args,
      });
    },
    verifyOtp(args = {}) {
      return this._get({
        path: "/verification/result",
        ...args,
      });
    },
    _baseUrl() {
      return "https://www.fraudlabspro.com";
    },
    _makeRequest({
      $ = this, path, params, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: this.$auth.api_key,
        },
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    webhookSubscribe(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipedream-webhook-subscribe",
        ...args,
      });
    },
    webhookUnsubscribe(args = {}) {
      return this._makeRequest({
        path: "/pipedream-webhook-unsubscribe",
        ...args,
      });
    },
    _apiBaseUrl() {
      return `${API_BASE_URL}/${API_VERSION}`;
    },
    // `format` is an overridable default; `key` is applied last so caller input
    // cannot override it.
    _get({
      $ = this, path, params, ...args
    }) {
      return axios($, {
        url: `${this._apiBaseUrl()}${path}`,
        params: {
          format: "json",
          ...params,
          key: this.$auth.api_key,
        },
        ...args,
      });
    },
    // FraudLabs Pro v2 write endpoints read fields from the form-urlencoded
    // request body, not the query string.
    _post({
      $ = this, path, data, ...args
    }) {
      return axios($, {
        url: `${this._apiBaseUrl()}${path}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams({
          format: "json",
          ...data,
          key: this.$auth.api_key,
        }).toString(),
        ...args,
      });
    },
  },
};
