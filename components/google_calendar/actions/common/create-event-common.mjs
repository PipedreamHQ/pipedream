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
      },
      repeatInterval: {
        type: "integer",
        label: "Repeat Interval",
        description: "Enter 1 to \"repeat every day\", enter 2 to \"repeat every other day\", etc. Defaults to 1.",
        optional: true,
      },
      repeatSpecificDays: {
        type: "string[]",
        label: "Repeat Specific Days",
        description: "The event will repeat on these days of the week. Repeat Frequency must be `WEEKLY`.",
        optional: true,
        options: constants.DAYS_OF_WEEK,
      },
      repeatUntil: {
        type: "string",
        label: "Repeat Until",
        description: "The event will repeat only until this date, if set. Only one of `Repeat Until` or Repeat `How Many Times` may be entered.",
        optional: true,
      },
      repeatTimes: {
        type: "integer",
        label: "Repeat How Many Times?",
        description: "Limit the number of times this event will occur. Only one of `Repeat Until` or Repeat `How Many Times` may be entered.",
        optional: true,
      },
    }
  ),
  conferenceProps: ({ isUpdate }) => ({
    conferenceUrl: {
      label: "Conference URL",
      type: "string",
      description: `Join URL of a Zoom, Microsoft Teams, Webex or other video meeting to attach as the event's conference, shown in Google Calendar as a join button, e.g. \`https://zoom.us/j/1234567890\`. Google Calendar can't create Zoom meetings: create one first with **Zoom > Create Meeting** and pass its \`join_url\`.${isUpdate
        ? " Replaces the event's current conference, including a Google Meet link."
        : " Not used with `Create Meet Room`."}`,
      optional: true,
    },
    conferenceName: {
      label: "Conference Name",
      type: "string",
      description: "Name shown for the conference, e.g. `Zoom Meeting`. Defaults to the provider name for Zoom, Microsoft Teams and Webex links, otherwise `Video Meeting`. Only used with `Conference URL`.",
      optional: true,
    },
    ...(isUpdate && {
      removeConference: {
        label: "Remove Conference",
        type: "boolean",
        description: "Set to `true` to remove the event's video conference, such as a Google Meet or Zoom link. Not used with `Conference URL`.",
        optional: true,
      },
    }),
  }),
  methods: {
    getConferenceUrl() {
      const value = this.conferenceUrl?.trim();
      if (!value) {
        return;
      }
      const url = URL.canParse(value)
        ? new URL(value)
        : null;
      if (![
        "http:",
        "https:",
      ].includes(url?.protocol)) {
        throw new ConfigurationError(`\`Conference URL\` must be an http(s) URL, got \`${value}\``);
      }
      if (this.createMeetRoom || this.removeConference) {
        throw new ConfigurationError("`Conference URL` can't be combined with `Create Meet Room` or `Remove Conference`: set only one.");
      }
      return url;
    },
    buildConferenceData(url) {
      const host = url.hostname.toLowerCase();
      const provider = constants.CONFERENCE_NAMES_BY_DOMAIN.find(
        ({ domain }) => host === domain || host.endsWith(`.${domain}`),
      );
      return {
        conferenceSolution: {
          key: {
            type: constants.CONFERENCE_SOLUTION_TYPE_ADD_ON,
          },
          name: this.conferenceName?.trim()
            || provider?.name
            || constants.DEFAULT_CONFERENCE_NAME,
        },
        entryPoints: [
          {
            entryPointType: constants.CONFERENCE_ENTRY_POINT_TYPE_VIDEO,
            uri: url.href,
          },
        ],
      };
    },
    applyConferenceChange(resource, conferenceUrl) {
      if (conferenceUrl) {
        resource.conferenceData = this.buildConferenceData(conferenceUrl);
        return constants.CONFERENCE_DATA_VERSION;
      }
      if (this.removeConference) {
        delete resource.conferenceData;
        delete resource.hangoutLink;
        return constants.CONFERENCE_DATA_VERSION;
      }
    },
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
        this.conferenceUrl?.trim(),
        this.removeConference,
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
