import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "commpeak",
  propDefinitions: {
    smsNumber: {
      type: "string",
      label: "SMS Number",
      description: "The phone number of the incoming SMS",
      optional: false,
    },
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "The phone numbers of the SMS recipients",
      optional: false,
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be sent",
      optional: false,
    },
    scheduledTime: {
      type: "string",
      label: "Scheduled Time",
      description: "The scheduled time to send the message (optional)",
      optional: true,
    },
    clickCountLimit: {
      type: "integer",
      label: "Click Count Limit",
      description: "The maximum number of clicks for the URL (optional)",
      optional: true,
    },
    specificUrl: {
      type: "string",
      label: "Specific URL",
      description: "The specific URL to track clicks for (optional)",
      optional: true,
    },
    apiEndpoint: {
      type: "string",
      label: "API Endpoint",
      description: "The CommPeak API endpoint you're trying to access",
      optional: false,
    },
    apiData: {
      type: "object",
      label: "API Data",
      description: "The data to be sent in the API request",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.commpeak.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, data, params, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        params,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async sendSMS({
      recipients, messageContent, scheduledTime,
    }) {
      const data = {
        recipients,
        messageContent,
        ...(scheduledTime && {
          scheduledTime,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/sendSMS",
        data,
      });
    },
    async customAPIRequest({
      apiEndpoint, apiData,
    }) {
      return this._makeRequest({
        method: "POST",
        path: apiEndpoint,
        data: apiData,
      });
    },
  },
};
