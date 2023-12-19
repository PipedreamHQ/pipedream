import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "addevent",
  propDefinitions: {
    calendarId: {
      type: "string",
      label: "Calendar ID",
      description: "The ID of the calendar that this event will be associated with.",
      async options() {
        const { data } = await this.listCalendars();
        return data.map((calendar) => ({
          label: calendar.title,
          value: calendar._id,
        }));
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event.",
      async options() {
        const { data } = await this.listEvents();
        return data.map((event) => ({
          label: event.title,
          value: event._id,
        }));
      },
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start date & time of the event.",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end date & time of the event.",
    },
    location: {
      type: "string",
      label: "Location",
      description: "The event's location. This can be an address or a URL.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The event's description.",
      optional: true,
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "The attendees of the event.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.addevent.com/calevent/v2";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listCalendars() {
      return this._makeRequest({
        path: "/calendars",
      });
    },
    async listEvents() {
      return this._makeRequest({
        path: "/events",
      });
    },
    async createEvent({
      calendarId, eventName, startTime, endTime, location, description, attendees,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events",
        data: {
          title: eventName,
          calendar_id: calendarId,
          datetime_start: startTime,
          datetime_end: endTime,
          location,
          description,
          attendees,
        },
      });
    },
    async createRsvp({
      eventId, attendees,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventId}/rsvps`,
        data: {
          attendees,
        },
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
