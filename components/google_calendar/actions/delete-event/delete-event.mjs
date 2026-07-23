import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-delete-event",
  name: "Delete an Event",
  description: "Delete a single event from a Google Calendar. This permanently cancels the event and cannot be undone. Deletes only the one event identified by `eventId` — it does NOT clear a whole day or delete multiple events. When the user asks to delete several events, clear a day, or the target is ambiguous, first confirm with the user (ideally listing what will be deleted) before calling this, and call it once per event. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#delete)",
  version: "0.1.13",
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
