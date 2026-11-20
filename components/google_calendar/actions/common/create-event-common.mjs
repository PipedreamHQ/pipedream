import { ConfigurationError } from "@pipedream/platform";
import googleCalendar from "../../google_calendar.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

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
      },
      repeatInterval: {
        propDefinition: [
          googleCalendar,
          "repeatInterval",
        ],
      },
      repeatSpecificDays: {
        type: "string[]",
        label: "Repeat Specific Days",
        description: "The event will repeat on these days of the week. Repeat Frequency must be `WEEKLY`.",
        optional: true,
        options: constants.DAYS_OF_WEEK,
      },
      repeatUntil: {
        propDefinition: [
          googleCalendar,
          "repeatUntil",
        ],
      },
      repeatTimes: {
        propDefinition: [
          googleCalendar,
          "repeatTimes",
        ],
      },
    }
  ),
  methods: {
    hasSharedFieldInput() {
      return [
        this.summary,
        this.eventStartDate,
        this.eventEndDate,
        this.location,
        this.description,
        this.parseEmails(this.attendees).length,
        this.repeatFrequency,
        this.repeatInterval,
        this.repeatTimes,
        this.repeatUntil,
        this.repeatSpecificDays?.length,
        this.timeZone,
      ].some(Boolean);
    },
    isPersonalFieldsOnlyUpdate() {
      return (this.colorId || this.transparency) && !this.hasSharedFieldInput();
    },
    async patchPersonalFields(eventId) {
      // colorId and transparency are per-copy, so this never touches other guests
      return this.googleCalendar.patchEvent({
        calendarId: this.calendarId,
        eventId,
        sendUpdates: constants.SEND_UPDATES_NONE,
        requestBody: {
          ...(this.colorId && {
            colorId: this.colorId,
          }),
          ...(this.transparency && {
            transparency: this.transparency,
          }),
        },
      });
    },
    async getTimeZone(selectedTimeZone) {
      /**
      * Based on the IANA Time Zone DB
      * http://www.iana.org/time-zones
      */
      if (selectedTimeZone) {
        return selectedTimeZone;
      }
      const { value: timeZone } = await this.googleCalendar.getSettings({
        setting: "timezone",
      });
      return timeZone;
    },
    parseEmails(input) {
      if (typeof input === "string") {
        const trimmed = input.trim();
        // Accept a JSON-stringified array too (e.g. '["a@x.com","b@y.com"]'),
        // which LLM callers commonly emit for a string-typed "array or CSV" prop.
        // Without this, JSON.stringify output is comma-split into malformed tokens
        // like `["a@x.com"` that the API rejects as "Invalid attendee email".
        if (trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              return parsed
                .filter((e) => typeof e === "string")
                .map((e) => e.trim())
                .filter(Boolean);
            }
          } catch {
            // Not valid JSON — fall through to comma-splitting.
          }
        }
        return trimmed.split(",")
          .map((e) => e.trim())
          .filter(Boolean);
      }
      if (Array.isArray(input)) {
        return input
          .filter((e) => typeof e === "string")
          .map((e) => e.trim())
          .filter(Boolean);
      }
      return [];
    },
    formatAttendees(selectedAttendees, currentAttendees) {
      const emails = this.parseEmails(selectedAttendees);

      if (emails.length) {
        return emails.map((email) => ({
          email,
        }));
      }

      // Fall back to currentAttendees if no selectedAttendees
      const fallbackEmails = this.parseEmails(currentAttendees);
      if (fallbackEmails.length) {
        return fallbackEmails.map((email) => ({
          email,
        }));
      }

      // Handle currentAttendees as array of attendee objects
      if (Array.isArray(currentAttendees) && currentAttendees.length) {
        return currentAttendees
          .filter((a) => a && typeof a.email === "string")
          .map((attendee) => ({
            email: attendee.email.trim(),
          }))
          .filter((a) => a.email);
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
      repeatSpecificDays,
    }) {
      if (!repeatFrequency
        && (repeatInterval || repeatTimes || repeatUntil || repeatSpecificDays)
      ) {
        throw new ConfigurationError("`Repeat Frequency` is required when `Repeat Interval`, `Repeat Times`, `Repeat Until`, or `Repeat Specific Days` is entered.");
      }
      if (repeatInterval !== undefined && !utils.isPositiveInteger(repeatInterval)) {
        throw new ConfigurationError("`Repeat Interval` must be a positive integer.");
      }
      if (repeatTimes !== undefined && !utils.isPositiveInteger(repeatTimes)) {
        throw new ConfigurationError("`Repeat How Many Times?` must be a positive integer.");
      }
      if (!repeatFrequency) {
        return;
      }
      if (repeatTimes && repeatUntil) {
        throw new ConfigurationError("Only one of `Repeat Until` or Repeat `How Many Times` may be entered");
      }
      if (repeatSpecificDays && repeatFrequency !== "WEEKLY") {
        throw new ConfigurationError("`Repeat Specific Days` is only for use with `Repeat Frequency` of `WEEKLY`.");
      }

      let recurrence = `RRULE:FREQ=${repeatFrequency}` ;
      if (repeatSpecificDays?.length) {
        const byDay = [
          ...new Set(
            repeatSpecificDays.flatMap((value) => value.split(",")),
          ),
        ].join(",");
        recurrence = `${recurrence};BYDAY=${byDay}`;
      }
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
