import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamup",
  propDefinitions: {
    calendarKey: {
      type: "string",
      label: "Calendar Key",
      description: "Key associated with a calendar. [Calendar keys](https://apidocs.teamup.com/docs/api/ZG9jOjI4Mzk0ODA4-teamup-com-api-overview#calendar-key) are managed using the Web-based calendar settings application. Look for the Sharing tab.",
    },
    subCalendarIds: {
      type: "string[]",
      label: "Sub-calendars",
      description: "Array of sub-calendar identifiers",
      async options({ calendarKey }) {
        const { subcalendars } = await this.listSubcalendars({
          calendarKey,
        });
        return subcalendars?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    eventId: {
      type: "string",
      label: "Event",
      description: "Identifier of an event",
      async options({
        calendarKey, prevContext,
      }) {
        const offset = prevContext?.offset || 0;
        const { events } = await this.listEvents({
          calendarKey,
          params: {
            startDate: this.getFormattedDate(offset),
            endDate: this.getFormattedDate(offset + 30),
          },
        });
        const options = events?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            offset: offset + 30,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the event",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start Date of the event in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End Date of the event in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.",
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location of the event",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Details of the event",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.teamup.com";
    },
    _headers() {
      return {
        "Teamup-Token": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getEvent({
      calendarKey, eventId, ...args
    }) {
      return this._makeRequest({
        path: `/${calendarKey}/events/${eventId}`,
        ...args,
      });
    },
    listSubcalendars({
      calendarKey, ...args
    }) {
      return this._makeRequest({
        path: `/${calendarKey}/subcalendars`,
        ...args,
      });
    },
    listEvents({
      calendarKey, ...args
    }) {
      return this._makeRequest({
        path: `/${calendarKey}/events`,
        ...args,
      });
    },
    createEvent({
      calendarKey, ...args
    }) {
      return this._makeRequest({
        path: `/${calendarKey}/events`,
        method: "POST",
        ...args,
      });
    },
    updateEvent({
      calendarKey, eventId, ...args
    }) {
      return this._makeRequest({
        path: `/${calendarKey}/events/${eventId}`,
        method: "PUT",
        ...args,
      });
    },
    deleteEvent({
      calendarKey, eventId, ...args
    }) {
      return this._makeRequest({
        path: `/${calendarKey}/events/${eventId}`,
        method: "DELETE",
        ...args,
      });
    },
    getFormattedDate(daysToAdd) {
      const today = new Date();
      today.setDate(today.getDate() + daysToAdd);

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
  },
};
