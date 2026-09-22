import googleMeet from "../../google_meet.app.mjs";

export default {
  key: "google_meet-update-meeting",
  name: "Update Meeting",
  description: "Update a scheduled meeting. Only the fields you provide are changed; the Google Meet link is preserved. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/patch)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleMeet,
    calendarId: {
      propDefinition: [
        googleMeet,
        "calendarId",
      ],
    },
    eventId: {
      propDefinition: [
        googleMeet,
        "eventId",
      ],
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "A new title for the meeting",
      optional: true,
    },
    location: {
      label: "Event Location",
      type: "string",
      description: "A new location for the meeting",
      optional: true,
    },
    description: {
      label: "Event Description",
      type: "string",
      description: "A new description for the meeting",
      optional: true,
    },
    attendees: {
      label: "Attendees",
      type: "string[]",
      description: "Replace the meeting attendees with this array of email addresses, e.g. `[\"alice@example.com\", \"bob@example.com\"]`",
      optional: true,
    },
    eventStartDate: {
      label: "Event Start Date",
      type: "string",
      description: "For all-day events, use the format `yyyy-mm-dd` (e.g. `2026-07-27`). For timed events, use [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1) (e.g. `2026-07-27T14:30:00-04:00`). A time zone offset is required unless a time zone is explicitly specified in Time Zone.",
      optional: true,
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "For all-day events, use the format `yyyy-mm-dd` (e.g. `2026-07-27`). For timed events, use [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1) (e.g. `2026-07-27T15:30:00-04:00`). A time zone offset is required unless a time zone is explicitly specified in Time Zone.",
      optional: true,
    },
    timeZone: {
      propDefinition: [
        googleMeet,
        "timeZone",
      ],
    },
    colorId: {
      propDefinition: [
        googleMeet,
        "colorId",
      ],
    },
    sendUpdates: {
      propDefinition: [
        googleMeet,
        "sendUpdates",
      ],
    },
  },
  methods: {
    getDateParam({
      date, timeZone,
    }) {
      if (!date) {
        return undefined;
      }
      return {
        date: date.length <= 10
          ? date
          : undefined,
        dateTime: date.length > 10
          ? date
          : undefined,
        timeZone,
      };
    },
  },
  async run({ $ }) {
    const resource = {
      summary: this.summary,
      location: this.location,
      description: this.description,
      colorId: this.colorId,
      start: this.getDateParam({
        date: this.eventStartDate,
        timeZone: this.timeZone,
      }),
      end: this.getDateParam({
        date: this.eventEndDate,
        timeZone: this.timeZone,
      }),
      attendees: this.attendees && this.attendees.map((email) => ({
        email,
      })),
    };

    const response = await this.googleMeet.updateEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      sendUpdates: this.sendUpdates,
      conferenceDataVersion: 1,
      resource,
    });

    $.export("$summary", `Successfully updated meeting "${response.summary || response.id}"`);

    return response;
  },
};
