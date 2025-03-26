import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splunk_http_event_collector",
  propDefinitions: {
    channel: {
      type: "string",
      label: "Channel",
      description: "Channel GUID to differentiate data from different clients",
    },
    sourcetype: {
      type: "string",
      label: "Sourcetype",
      description: "The sourcetype of the event",
    },
    index: {
      type: "string",
      label: "Index",
      description: "The index to send the event to",
      optional: true,
    },
    host: {
      type: "string",
      label: "Host",
      description: "The host sending the event",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}:${this.$auth.port}`;
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Splunk ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    checkHealth(opts = {}) {
      return this._makeRequest({
        path: "/services/collector/health",
        ...opts,
      });
    },
    sendEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/services/collector",
        ...opts,
      });
    },
    sendMultipleEvents(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/services/collector/raw",
        ...opts,
      });
    },
  },
};
