import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-delete-event",
  name: "Delete an Event",
  description: "Delete an event from a Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#delete)",
  version: "0.1.9",
  annotations: {
    destructiveHint: true,
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
    eventId: {
      propDefinition: [
        googleCalendar,
        "eventId",
        (c) => ({
          calendarId: c.calendarId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.deleteEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      returnOnlyData: false,
    });

    $.export("$summary", `Successfully deleted event: "${this.eventId}"`);

    return response;
  },
};
