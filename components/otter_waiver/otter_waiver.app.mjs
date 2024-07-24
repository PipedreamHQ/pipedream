import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "otter_waiver",
  propDefinitions: {
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event for which the participant is checking in",
      async options() {
        const events = await this.getEvents();
        return events.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      },
    },
    signeeDetails: {
      type: "object",
      label: "Signee Details",
      description: "Details of the new signee",
    },
    checkInTime: {
      type: "string",
      label: "Check-In Time",
      description: "The time the participant checked in",
      optional: true,
    },
    signeePreferences: {
      type: "object",
      label: "Signee Preferences",
      description: "Preferences of the new signee",
      optional: true,
    },
    signeeSubscriptions: {
      type: "object",
      label: "Signee Subscriptions",
      description: "Subscriptions of the new signee",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.otterwaiver.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async subscribeToEvent({
      trigger, webhook,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/subscribe",
        data: {
          trigger,
          webhook,
        },
      });
    },
    async unsubscribeFromEvent({
      trigger, webhook,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/unsubscribe",
        data: {
          trigger,
          webhook,
        },
      });
    },
    async getLatestCheckIns() {
      return this._makeRequest({
        method: "GET",
        path: "/participants/latest/checkins",
      });
    },
    async getLatestParticipants() {
      return this._makeRequest({
        method: "GET",
        path: "/participants/latest",
      });
    },
    async getEvents() {
      return this._makeRequest({
        path: "/events",
      });
    },
  },
};
