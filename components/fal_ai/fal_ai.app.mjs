import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fal_ai",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The unique identifier for the app. Eg. `lora`.",
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "The unique identifier for the request.",
    },
    logs: {
      type: "boolean",
      label: "Enable Logs",
      description: "Specify if logs should be enabled for the request status.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://queue.fal.run/fal-ai${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Key ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    getRequestStatus({
      appId, requestId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${appId}/requests/${requestId}/status`,
        ...args,
      });
    },
    getRequestResponse({
      appId, requestId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${appId}/requests/${requestId}`,
        ...args,
      });
    },
  },
};
