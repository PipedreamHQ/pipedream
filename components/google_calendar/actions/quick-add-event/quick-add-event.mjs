import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-quick-add-event",
  name: "Add Quick Event",
  description: "Create an event to the Google Calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#quickAdd)",
  version: "0.1.0",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    text: {
      label: "Event Title",
      type: "string",
      description: "Enter static text (e.g., `hello world`) for the event name",
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.quickAddEvent({
      calendarId: this.calendarId,
      text: this.text,
    });

    $.export("$summary", `Successfully quick added event ${response.id}`);

    return response;
  },
};
