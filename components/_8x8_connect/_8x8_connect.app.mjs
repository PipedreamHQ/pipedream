import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_8x8_connect",
  propDefinitions: {
    destination: {
      type: "string",
      label: "Destination",
      description: "Destination of the SMS, i.e. `+12124567890`",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the message",
    },
    from: {
      type: "string",
      label: "From",
      description: "The initial date of the log, i.e. `2024-08-14T00:00:00`",
    },
    to: {
      type: "string",
      label: "To",
      description: "The initial date of the log, i.e. `2024-08-15T10:00:00`",
    },
    jobId: {
      type: "string",
      label: "Log ID",
      description: "The ID of the log",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.base_url}/api/v1`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async sendSms(args = {}) {
      return this._makeRequest({
        method: "post",
        path: `/subaccounts/${this.$auth.subaccount_id}/messages`,
        ...args,
      });
    },
    async requestLog(args = {}) {
      return this._makeRequest({
        method: "post",
        path: `/subaccounts/${this.$auth.subaccount_id}/messages/exports`,
        ...args,
      });
    },
    async getLog({
      jobId, ...args
    }) {
      return this._makeRequest({
        path: `/subaccounts/${this.$auth.subaccount_id}/messages/exports/${jobId}`,
        ...args,
      });
    },
  },
};
