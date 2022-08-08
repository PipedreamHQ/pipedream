import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-create-event",
  name: "Create Event",
  description: "Create an event to the Google Calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#insert)",
  version: "0.1.3",
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
      description: "Enter static text (e.g., `hello world`) for the event name",
      optional: true,
    },
    location: {
      label: "Event Venue",
      type: "string",
      description: "Enter static text (e.g., `hello world`) for the event venue",
      optional: true,
    },
    description: {
      label: "Event Description",
      type: "string",
      description: "Enter detailed event description",
      optional: true,
    },
    attendees: {
      label: "Attendees",
      type: "string[]",
      description: "Enter the EmailId of the attendees",
      optional: true,
    },
    eventStartDate: {
      label: "Event Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format 'yyyy-mm-dd'. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): 'yyyy-mm-ddThh:mm:ss+01:00'. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format 'yyyy-mm-dd'. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): 'yyyy-mm-ddThh:mm:ss+01:00'. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
    },
    sendUpdates: {
      label: "Send Updates",
      type: "string",
      description: "Whether to send notifications about the creation of the new event.",
      optional: true,
      options: [
        "all",
        "externalOnly",
        "none",
      ],
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
    },
  },
  async run({ $ }) {
    /**
     * Based on the IINA Time Zone DB
     * http://www.iana.org/time-zones
     */
    const { value: timeZone } = this.timeZone ?? await this.googleCalendar.getSettings({
      setting: "timezone",
    });

    /**
     * Format for the attendees
     *
     * [
     *   { "email": "lpage@example.com",},
     *   { "email": "sbrin@example.com",},
     * ]
     */

    let attendees = [];

    if (this.attendees && Array.isArray(this.attendees)) {
      attendees = this.attendees.map((email) => ({
        email,
      }));
    }

    const response = await this.googleCalendar.createEvent({
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates ?? false,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: {
          date: this.eventStartDate.length <= 10
            ? this.eventStartDate
            : undefined,
          dateTime: this.eventStartDate.length > 10
            ? this.eventStartDate
            : undefined,
          timeZone,
        },
        end: {
          date: this.eventEndDate.length <= 10
            ? this.eventEndDate
            : undefined,
          dateTime: this.eventEndDate.length > 10
            ? this.eventEndDate
            : undefined,
          timeZone,
        },
        attendees,
      },
    });

    $.export("$summary", `Successfully created event ${response.id}`);

    return response;
  },
};
