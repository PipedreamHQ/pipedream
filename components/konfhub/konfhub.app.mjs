import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "konfhub",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "Email address of the user",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "ID of the event",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.konfhub.com";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    validateRegistration(args) {
      return this._makeRequest({
        url: "/validate",
        ...args,
      });
    },
    sendOTP({
      eventId, ...args
    }) {
      return this._makeRequest({
        url: `/event/${eventId}/referral/otp`,
        ...args,
      });
    },
  },
};
