import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "callhub",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "Type of call event to watch for",
      options: constants.CALL_EVENT_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.callhub.io/v1";
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/",
        ...args,
      });
    },
    deleteWebhook(hookId, args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...args,
      });
    },
  },
};
