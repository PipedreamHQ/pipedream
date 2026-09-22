import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fal_ai",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The full canonical ID of the model to call, including the owner namespace. E.g. `fal-ai/flux/schnell`, `rundiffusion-fal/juggernaut-flux/base`, or `your-username/your-app`. As a shorthand, a bare single-word name (e.g. `lora`) is accepted and assumed to be in the `fal-ai` namespace.",
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
      return `https://queue.fal.run${path}`;
    },
    getAppId(appId) {
      // Model IDs are `owner/model` (e.g. `fal-ai/flux/schnell`,
      // `rundiffusion-fal/juggernaut-flux/base`, `your-username/your-app`), so any
      // input that already contains a slash is treated as a full canonical ID and
      // left untouched. A bare single-word name has no owner segment and can only
      // refer to a `fal-ai` model, so we prepend the default namespace for it.
      return appId.includes("/")
        ? appId
        : `fal-ai/${appId}`;
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
        path: `/${this.getAppId(appId)}/requests/${requestId}/status`,
        ...args,
      });
    },
    getRequestResponse({
      appId, requestId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/${this.getAppId(appId)}/requests/${requestId}`,
        ...args,
      });
    },
  },
};
