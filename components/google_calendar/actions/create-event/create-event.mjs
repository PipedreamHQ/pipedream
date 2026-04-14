import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import { v4 as uuidv4 } from "uuid";
import constants from "../../common/constants.mjs";

export default {
  key: "google_calendar-create-event",
  name: "Create Event",
  description: "Create an event in a Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/insert)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter a title for the event, (e.g., `My event`)",
    },
    eventStartDate: {
      label: "Event Start Date",
      type: "string",
      description: "For all-day events, enter the date in the format `yyyy-mm-dd` (e.g., `2025-01-15`). For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00` (e.g., `2025-01-15T10:00:00-05:00`). A time zone offset is required unless a time zone is explicitly specified in timeZone.",
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "For all-day events, enter the date in the format `yyyy-mm-dd` (e.g., `2025-01-15`). For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00` (e.g., `2025-01-15T11:00:00-05:00`). A time zone offset is required unless a time zone is explicitly specified in timeZone.",
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
      description: "An array of email addresses (e.g., `[\"alice@example.com\", \"bob@example.com\"]`)",
      optional: true,
    },
    colorId: {
      propDefinition: [
        googleCalendar,
        "colorId",
      ],
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
    createMeetRoom: {
      type: "boolean",
      label: "Create Meet Room",
      description: "Whether to create a Google Meet room for this event.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Visibility of the event",
      options: [
        "default",
        "public",
        "private",
        "confidential",
      ],
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
  },
  methods: {
    ...createEventCommon.methods,
  },
  async run({ $ }) {
    const timeZone = await this.getTimeZone(this.timeZone);
    const attendees = this.formatAttendees(this.attendees);
    const recurrence = this.formatRecurrence({
      repeatFrequency: this.repeatFrequency,
      repeatInterval: this.repeatInterval,
      repeatTimes: this.repeatTimes,
      repeatUntil: this.repeatUntil,
      repeatSpecificDays: this.repeatSpecificDays,
    });

    const trimmedStart = this.eventStartDate?.trim();
    const trimmedEnd = this.eventEndDate?.trim();

    const data = {
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: {
          date: trimmedStart?.length <= 10
            ? trimmedStart
            : undefined,
          dateTime: trimmedStart?.length > 10
            ? trimmedStart
            : undefined,
          timeZone,
        },
        end: {
          date: trimmedEnd?.length <= 10
            ? trimmedEnd
            : undefined,
          dateTime: trimmedEnd?.length > 10
            ? trimmedEnd
            : undefined,
          timeZone,
        },
        recurrence,
        attendees,
        colorId: this.colorId,
        visibility: this.visibility,
      },
    };

    if (this.createMeetRoom) {
      data.conferenceDataVersion = 1;
      data.resource.conferenceData = {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      };
    }

    const response = await this.googleCalendar.createEvent(data);

    $.export("$summary", `Successfully created event with ID: "${response.id}"`);

    return response;
  },
};
