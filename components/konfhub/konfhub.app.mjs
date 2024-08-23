import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "konfhub",
  propDefinitions: {
    eventReference: {
      type: "string",
      label: "Event Reference",
      description: "The unique identifier for the event.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.konfhub.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        data,
        params,
      });
    },
    async emitEventForRegistrationCancellation({ eventReference }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/event/${eventReference}/referral/cancel`,
      });
    },
    async emitEventForNewRegistration({
      eventReference, emailId, otp,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/event/${eventReference}/validateOTP`,
        data: {
          email_id: emailId,
          otp: otp,
        },
      });
    },
    async emitEventForNewLead({ eventReference }) {
      // Assuming the API call for generating a new lead is similar to registration
      // As there's no direct API endpoint provided for new lead generation in the instructions
      return this._makeRequest({
        method: "POST",
        path: `/event/${eventReference}/lead/new`,
      });
    },
  },
};
