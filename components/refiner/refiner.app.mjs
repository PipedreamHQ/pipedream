import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "refiner",
  version: "0.0.{{ts}}",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to identify or track events for.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user to identify or track events for.",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event or signal being tracked.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.refiner.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    async identifyUser(opts = {}) {
      const {
        userId, email, ...attributes
      } = opts;
      if (!userId && !email) {
        throw new Error("Either userId or email must be provided to identify the user.");
      }
      const data = {
        ...(userId && {
          id: userId,
        }),
        ...(email && {
          email,
        }),
        ...attributes,
      };
      return this._makeRequest({
        method: "POST",
        path: "/identify-user",
        data,
      });
    },
    async trackEvent(opts = {}) {
      const {
        eventName, userId, email,
      } = opts;
      if (!eventName) {
        throw new Error("eventName is required to track an event.");
      }
      if (!userId && !email) {
        throw new Error("Either userId or email must be provided to track the event.");
      }
      const data = {
        event: eventName,
        ...(userId && {
          id: userId,
        }),
        ...(email && {
          email,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/track-event",
        data,
      });
    },
    async emitSurveyCompleted() {
      return this._makeRequest({
        method: "POST",
        path: "/emit-survey-completed",
      });
    },
    async emitSegmentEntered() {
      return this._makeRequest({
        method: "POST",
        path: "/emit-segment-entered",
      });
    },
  },
};
