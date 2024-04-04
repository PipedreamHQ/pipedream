import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_meet",
  propDefinitions: {
    calendar: {
      type: "string",
      label: "Calendar",
      description: "The calendar to create the event in",
      async options() {
        const { items } = await this.listCalendars();
        return items.map((calendar) => ({
          label: calendar.summary,
          value: calendar.id,
        }));
      },
    },
    eventTitle: {
      type: "string",
      label: "Event Title",
      description: "The title of the event",
      optional: true,
    },
    eventDescription: {
      type: "string",
      label: "Event Description",
      description: "The description of the event",
      optional: true,
    },
    eventStartDate: {
      type: "string",
      label: "Event Start Date",
      description: "The start date of the event",
    },
    eventEndDate: {
      type: "string",
      label: "Event End Date",
      description: "The end date of the event",
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "The email addresses of the attendees",
      optional: true,
    },
    createMeetRoom: {
      type: "boolean",
      label: "Create Meet Room",
      description: "Whether to create a Google Meet room for the event",
      default: true,
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.googleapis.com/calendar/v3";
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
        path: "/users/me/calendarList",
      });
    },
    async createEvent(opts = {}) {
      const {
        calendarId, ...otherOpts
      } = opts;
      return this._makeRequest({
        ...otherOpts,
        method: "POST",
        path: `/calendars/${calendarId}/events`,
        data: {
          summary: opts.eventTitle,
          description: opts.eventDescription,
          start: {
            dateTime: opts.eventStartDate,
          },
          end: {
            dateTime: opts.eventEndDate,
          },
          attendees: opts.attendees.map((email) => ({
            email,
          })),
          conferenceData: {
            createRequest: {
              requestId: Math.random().toString(36)
                .substring(2),
              conferenceSolutionKey: {
                type: opts.createMeetRoom
                  ? "hangoutsMeet"
                  : "eventHangout",
              },
            },
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
};
