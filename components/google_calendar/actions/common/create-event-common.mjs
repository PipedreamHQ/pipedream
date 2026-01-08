import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

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
        type: "string",
        description: "Enter either an array or a comma separated list of email addresses of attendees",
        optional: true,
      },
      repeatFrequency: {
        type: "string",
        label: "Repeat Frequency",
        description: "Select a frequency to make this event repeating",
        optional: true,
        options: Object.keys(constants.REPEAT_FREQUENCIES),
        reloadProps: true,
      },
      repeatInterval: {
        type: "integer",
        label: "Repeat Interval",
        description: "Enter 1 to \"repeat every day\", enter 2 to \"repeat every other day\", etc. Defaults to 1.",
        optional: true,
        hidden: true,
      },
      repeatUntil: {
        type: "string",
        label: "Repeat Until",
        description: "The event will repeat only until this date, if set",
        optional: true,
        hidden: true,
      },
      repeatTimes: {
        type: "integer",
        label: "Repeat How Many Times?",
        description: "Limit the number of times this event will occur",
        optional: true,
        hidden: true,
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
      if (selectedAttendees?.length) {
        return selectedAttendees.map((email) => ({
          email,
        }));
      }
      if (currentAttendees?.length) {
        return currentAttendees.map((attendee) => ({
          email: attendee.email,
        }));
      }
      return [];
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
      repeatInterval,
      repeatTimes,
      repeatUntil,
    }) {
      if (!repeatFrequency) {
        return;
      }
      if (repeatTimes && repeatUntil) {
        throw new ConfigurationError("Only one of `Repeat Until` or Repeat `How Many Times` may be entered");
      }

      let recurrence = `RRULE:FREQ=${repeatFrequency}`;
      if (repeatInterval) {
        recurrence = `${recurrence};INTERVAL=${repeatInterval}`;
      }
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
