import { ConfigurationError } from "@pipedream/platform";

export default {
  props: ({ isUpdate }) => (
    {
      summary: {
        label: "Event Title",
        type: "string",
        description: "Enter a title for the event, (e.g., `My event`)",
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
      repeatFrequency: {
        type: "string",
        label: "Repeat Frequency",
        description: "Select a frequency to make this event repeating",
        optional: true,
        options: [
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "YEARLY",
        ],
      },
      repeatUntil: {
        type: "string",
        label: "Repeat Until",
        description: "The event will repeat only until this date, if set",
        optional: true,
      },
      repeatTimes: {
        type: "integer",
        label: "Repeat How Many Times?",
        description: "Limit the number of times this event will occur",
        optional: true,
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
    /**
    * Format recurrence prop
    * https://developers.google.com/calendar/api/concepts/events-calendars#recurrence_rule
    */
    formatRecurrence({
      repeatFrequency,
      repeatTimes,
      repeatUntil,
    }) {
      if (!repeatUntil && !repeatTimes && !repeatUntil) {
        return;
      }
      if ((repeatUntil || repeatTimes) && !repeatFrequency) {
        throw new ConfigurationError("Repeat Frequency must be set to make event repeating");
      }
      if (repeatTimes && repeatUntil) {
        throw new ConfigurationError("Only one of Repeat Unitl or Repeat How Many Times may be entered");
      }

      let recurrence = `RRULE:FREQ=${repeatFrequency}`;
      if (repeatTimes) {
        recurrence = `${recurrence};COUNT=${repeatTimes}`;
      }
      if (repeatUntil) {
        const date = repeatUntil.slice(0, 10).replaceAll("-", "");
        recurrence = `${recurrence};UNTIL=${date}`;
      }
      return [
        recurrence,
      ];
    },
  },
};
