import googleCalendar from "../../google_calendar.app.mjs";

export default {
  props: ({ isUpdate }) => (
    {
      summary: {
        label: "Event Title",
        type: "string",
        description: "Enter a title for the event, (e.g., `My event`)",
        optional: true,
      },
      location: {
        label: "Event Location",
        type: "string",
        description: "Specify the location of the event",
        optional: true,
      },
      description: {
        label: "Event Description",
        type: "string",
        description: "Enter a description for the event",
        optional: true,
      },
      attendees: {
        label: "Attendees",
        type: "string[]",
        description: "Enter an array of email addresses for any attendees",
        optional: true,
      },
      eventStartDate: {
        label: "Event Start Date",
        type: "string",
        description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
        optional: isUpdate,
      },
      eventEndDate: {
        label: "Event End Date",
        type: "string",
        description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
        optional: isUpdate,
      },
      recurrence: {
        label: "Recurrence",
        type: "string[]",
        description: "Recurrence rule(s) for the event. For example, `FREQ=DAILY;INTERVAL=2` means once every two days, `RRULE:FREQ=YEARLY` means annually. [See the documentation](https://developers.google.com/calendar/api/concepts/events-calendars#recurrence_rule)",
        optional: true,
      },
      timeZone: {
        propDefinition: [
          googleCalendar,
          "timeZone",
        ],
      },
      sendUpdates: {
        propDefinition: [
          googleCalendar,
          "sendUpdates",
        ],
      },
      sendNotifications: {
        propDefinition: [
          googleCalendar,
          "sendNotifications",
        ],
      },
    }
  ),
  methods: {
    async getTimeZone(selectedTimeZone) {
      /**
      * Based on the IINA Time Zone DB
      * http://www.iana.org/time-zones
      */
      const { value: timeZone } = selectedTimeZone ?? await this.googleCalendar.getSettings({
        setting: "timezone",
      });
      return timeZone;
    },
    formatAttendees(selectedAttendees, currentAttendees) {
      /**
      * Format for the attendees
      *
      * [
      *   { "email": "lpage@example.com",},
      *   { "email": "sbrin@example.com",},
      * ]
      */
      let attendees = [];
      if (selectedAttendees && Array.isArray(selectedAttendees)) {
        attendees = selectedAttendees.map((email) => ({
          email,
        }));
      } else if (currentAttendees && Array.isArray(currentAttendees)) {
        return currentAttendees.map((attendee) => ({
          email: attendee.email,
        }));
      }
      return attendees;
    },
    checkDateOrDateTimeInput(date, type) {
      if (type === "date") {
        return date && date.length <= 10
          ? date
          : undefined;
      }
      if (type === "dateTime") {
        return date && date.length > 10
          ? date
          : undefined;
      }
    },
    getDateParam({
      date,
      timeZone,
    }) {
      return {
        date: this.checkDateOrDateTimeInput(date, "date"),
        dateTime: this.checkDateOrDateTimeInput(date, "dateTime"),
        timeZone,
      };
    },
  },
};
