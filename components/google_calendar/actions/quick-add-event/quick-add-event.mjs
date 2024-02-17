import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-quick-add-event",
  name: "Add Quick Event",
  description: "Create a quick event to the Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#quickAdd)",
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
    text: {
      label: "Event Title",
      type: "string",
      description: "Enter a title for the event, (e.g., `My event`)",
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.quickAddEvent({
      calendarId: this.calendarId,
      text: this.text,
    });

    $.export("$summary", `Successfully added a quick event: "${response.id}"`);

    return response;
  },
};
