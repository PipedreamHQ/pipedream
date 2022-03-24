import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
    getConfigApiBaseUrl() {
      // return "https://api.segmentapis.com";
      return "https://platform.segmentapis.com/v1beta";
    },
    getTrackingApiBaseUrl() {
      return "https://api.segment.io/v1";
    },
    getConfigApiUrl(path) {
      const baseUrl = this.getConfigApiBaseUrl();
      return `${baseUrl}${path}`;
    },
    getTrackingApiUrl(path) {
      const baseUrl = this.getTrackingApiBaseUrl();
      return `${baseUrl}${path}`;
    },
    getConfigApiHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.write_key}`,
      };
    },
    getTrackingApiHeaders() {
      return {
        Authorization: `Basic ${this.$auth.write_key}`,
      };
    },
    async makeRequest(customConfig) {
      const {
        $,
        api = constants.API.CONFIG,
        method,
        path,
        ...otherConfig
      } = customConfig;

      const url = api === constants.API.CONFIG
        ? this.getConfigApiUrl(path)
        : this.getTrackingApiUrl(path);

      const headers = api === constants.API.CONFIG
        ? this.getConfigApiHeaders()
        : this.getTrackingApiHeaders();

      const config = {
        method,
        url,
        headers,
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async alias(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/alias",
        ...args,
      });
    },
    async group(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/group",
        ...args,
      });
    },
    async identify(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/identify",
        ...args,
      });
    },
    async page(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/page",
        ...args,
      });
    },
    async screen(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/screen",
        ...args,
      });
    },
    async track(args = {}) {
      return this.makeRequest({
        api: constants.API.TRACKING,
        method: "post",
        path: "/track",
        ...args,
      });
    },
    async listWorkspaces(args = {}) {
      return this.makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    async createDestination({
      source, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `${source}/destinations`,
        ...args,
      });
    },
    async deleteDestination({
      source, destination, ...args
    }) {
      return this.makeRequest({
        method: "delete",
        path: `${source}/destinations/${destination}`,
        ...args,
      });
    },
    async listSources({
      workspace, ...args
    }) {
      return this.makeRequest({
        path: `/workspaces/${workspace}/sources`,
        ...args,
      });
    },
  },
};
