import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_outlook_calendar",
  propDefinitions: {
    eventId: {
      label: "Event ID",
      description: "The event ID",
      type: "string",
      async options() {
        const { value: events } = await this.listCalendarEvents();

        return events.map((event) => ({
          label: event.subject,
          value: event.id,
        }));
      },
    },
    recurringEventId: {
      label: "Recurring Event ID",
      description: "The ID of the recurring event series",
      type: "string",
      async options() {
        const { value: events } = await this.listCalendarEvents();

        return events
          .filter((event) => event.recurrence)
          .map((event) => ({
            label: event.subject,
            value: event.id,
          }));
      },
    },
    instanceId: {
      label: "Instance ID",
      description: "The ID of the specific occurrence of the recurring event",
      type: "string",
      async options({
        recurringEventId, startDateTime, endDateTime,
      }) {
        if (!recurringEventId || !startDateTime || !endDateTime) {
          return [];
        }
        const { value: instances } = await this.listEventInstances({
          eventId: recurringEventId,
          params: {
            startDateTime,
            endDateTime,
          },
        });

        return instances.map((instance) => ({
          label: `${instance.subject} - ${instance.start?.dateTime}`,
          value: instance.id,
        }));
      },
    },
    contentType: {
      label: "Content Type",
      description: "Content type (default `text`)",
      type: "string",
      optional: true,
      options: [
        "text",
        "html",
      ],
      default: "text",
    },
    content: {
      label: "Content",
      description: "Content of the email in text or html format",
      type: "string",
      optional: true,
    },
    timeZone: {
      label: "Time Zone",
      description: "Time zone of the event in supported time zones, [See the docs](https://docs.microsoft.com/en-us/graph/api/outlookuser-supportedtimezones)",
      type: "string",
      async options() {
        const timeZonesResponse = await this.getSupportedTimeZones();
        return timeZonesResponse.value.map((tz) => ({
          label: tz.displayName,
          value: tz.alias,
        }));
      },
    },
    start: {
      label: "Start",
      description: "Start date-time (yyyy-MM-ddThh:mm:ss) e.g. '2022-04-15T11:20:00'",
      type: "string",
    },
    end: {
      label: "End",
      description: "End date-time (yyyy-MM-ddThh:mm:ss) e.g. '2022-04-15T13:30:00'",
      type: "string",
    },
    attendees: {
      label: "Attendees",
      description: "Array of email addresses",
      type: "string[]",
    },
    location: {
      label: "Location",
      description: "Location of the event",
      type: "string",
      optional: true,
    },
    isOnlineMeeting: {
      label: "Is Online Meeting",
      description: "If it is online meeting or not",
      type: "boolean",
      optional: true,
    },
    expand: {
      label: "Expand",
      description: "Additional properties",
      type: "object",
      optional: true,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://graph.microsoft.com/v1.0${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
        "Content-Type": "application/json",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      try {
        const config = {
          url: this._getUrl(path),
          headers: this._getHeaders(headers),
          ...otherConfig,
        };
        return await axios($ ?? this, config);
      } catch (error) {
        throw new ConfigurationError(error.message);
      }
    },
    async createHook(args = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...args,
      });
      return response;
    },
    async renewHook({
      hookId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async deleteHook({
      hookId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${hookId}`,
        ...args,
      });
    },
    async getSupportedTimeZones() {
      return this._makeRequest({
        method: "GET",
        path: "/me/outlook/supportedTimeZones",
      });
    },
    async createCalendarEvent(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/me/events",
        ...args,
      });
    },
    async updateCalendarEvent({
      eventId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/me/events/${eventId}`,
        ...args,
      });
    },
    async deleteCalendarEvent({
      eventId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/me/events/${eventId}`,
        ...args,
      });
    },
    async listCalendarEvents(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/me/events",
        ...args,
      });
    },
    async getCalendarEvent({
      eventId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/me/events/${eventId}`,
        ...args,
      });
    },
    async listCalendarView(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/me/calendar/calendarView",
        ...args,
      });
    },
    async listEventInstances({
      eventId, ...args
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/me/events/${eventId}/instances`,
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/me/contacts",
        ...args,
      });
    },
    async listPeople(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/me/people",
        ...args,
      });
    },
  },
};
