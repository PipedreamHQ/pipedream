import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aevent",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user who registers for the event",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event for which the user registers",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.aevent.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async registerUserForEvent({
      userId, eventId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}/register`,
        data: {
          userId,
        },
      });
    },
    async emitNewUserEvent({
      userId, eventId,
    }) {
      await this.registerUserForEvent({
        userId,
        eventId,
      });
      this.$emit({
        id: `${userId}-${eventId}`,
        summary: `New user ${userId} registered for event ${eventId}`,
        ts: Date.now(),
      });
    },
  },
  version: "0.0.{{ts}}",
};
