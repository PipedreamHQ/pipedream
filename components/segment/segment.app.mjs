import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "segment",
  propDefinitions: {
    context: {
      type: "object",
      label: "Context",
      description: "Dictionary of extra information that provides useful context about a message, but is not directly related to the API call like ip address or locale",
      optional: true,
    },
    integrations: {
      type: "object",
      label: "Integrations",
      description: "Dictionary of destinations to either enable or disable",
      optional: true,
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "Timestamp when the message itself took place, defaulted to the current time by the Segment Tracking API. It is an ISO-8601 date string.",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Unique identifier for the user in your database., A userId or an anonymousId is required.",
      optional: true,
    },
    anonymousId: {
      type: "string",
      label: "Anonymous ID",
      description: "A pseudo-unique substitute for a User ID, for cases when you dont have an absolutely unique identifier. A userId or an anonymousId is required.",
      optional: true,
    },
  },
  methods: {
    getBaseUrl() {
      return "https://api.segment.io/v1";
    },
    getUrl(path) {
      const baseUrl = this.getBaseUrl();
      return `${baseUrl}${path}`;
    },
    getHeaders() {
      return {
        Authorization: `Basic ${this.$auth.write_key}`,
      };
    },
    makeRequest(customConfig) {
      const {
        $,
        method,
        path,
        data,
      } = customConfig;

      const config = {
        method,
        url: this.getUrl(path),
        headers: this.getHeaders(),
        data,
      };

      return axios($ || this, config);
    },
    alias({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/alias",
        data,
      });
    },
    group({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/group",
        data,
      });
    },
    identify({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/identify",
        data,
      });
    },
    page({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/page",
        data,
      });
    },
    screen({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/screen",
        data,
      });
    },
    track({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/track",
        data,
      });
    },
  },
};
