import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "posthog",
  propDefinitions: {
    event: {
      type: "string",
      label: "Event",
      description: "The name of the event to capture",
      required: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "An object with key-value pairs to further flesh out the event details",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.posthog.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
      });
    },
    async emitEvent({
      event, properties,
    }) {
      return this._makeRequest({
        path: "/e/",
        data: {
          event,
          properties,
        },
      });
    },
  },
};
