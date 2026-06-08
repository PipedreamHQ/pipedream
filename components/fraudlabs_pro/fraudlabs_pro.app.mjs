import { axios } from "@pipedream/platform";
import {
  API_BASE_URL, API_VERSION, FORM_BODY_METHODS,
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
      return this._apiRequest({
        method: "POST",
        path: "/verification/send",
        ...args,
      });
    },
    verifyOtp(args = {}) {
      return this._apiRequest({
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
    _apiRequest({
      $ = this, method = "get", path, params, data, ...args
    }) {
      const fields = {
        format: "json",
        ...params,
        ...data,
        key: this.$auth.api_key,
      };
      if (FORM_BODY_METHODS.includes(method.toLowerCase())) {
        return axios($, {
          url: `${this._apiBaseUrl()}${path}`,
          method,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: new URLSearchParams(fields).toString(),
          ...args,
        });
      }
      return axios($, {
        url: `${this._apiBaseUrl()}${path}`,
        method,
        params: fields,
        ...args,
      });
    },
  },
};
