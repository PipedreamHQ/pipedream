import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gleap",
  propDefinitions: {
    feedbackId: {
      type: "string",
      label: "Feedback ID",
      description: "The unique identifier for the feedback",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event",
    },
    eventData: {
      type: "object",
      label: "Event Data",
      description: "The data associated with the event",
    },
    eventDate: {
      type: "string",
      label: "Event Date",
      description: "The date of the event",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user",
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The name of the user",
      optional: true,
    },
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email of the user",
      optional: true,
    },
    userValue: {
      type: "string",
      label: "User Value",
      description: "The value associated with the user",
      optional: true,
    },
    userPhone: {
      type: "string",
      label: "User Phone",
      description: "The phone number of the user",
      optional: true,
    },
    userCreatedAt: {
      type: "string",
      label: "User Created At",
      description: "The creation date of the user record",
      optional: true,
    },
    customProperties: {
      type: "object",
      label: "Custom Properties",
      description: "Additional custom properties for the user",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gleap.io/admin";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method,
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        data,
        params,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Api-Token": this.$auth.api_token,
        },
        ...otherOpts,
      });
    },
    async trackEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/track",
        data: {
          events: [
            {
              date: opts.eventDate,
              name: opts.eventName,
              data: opts.eventData,
              userId: opts.userId,
            },
          ],
        },
      });
    },
    async identifyUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/identify",
        data: {
          userId: opts.userId,
          name: opts.userName,
          email: opts.userEmail,
          value: opts.userValue,
          phone: opts.userPhone,
          createdAt: opts.userCreatedAt,
          ...opts.customProperties,
        },
      });
    },
    async getFeedbacksOrderedByCreatedAt() {
      return this._makeRequest({
        method: "GET",
        path: "/feedbacks",
        params: {
          orderBy: "-createdat",
        },
      });
    },
    async getFeedbacksOrderedByUpdatedAt() {
      return this._makeRequest({
        method: "GET",
        path: "/feedbacks",
        params: {
          orderBy: "-updatedat",
        },
      });
    },
    async deleteFeedback(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/feedbacks/${opts.feedbackId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
