const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_quick_add_event",
  name: "Add Quick Event",
  description: "Create an event to the Google Calendar.",
  version: "0.0.8",
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
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.events.quickAdd({
      calendarId: this.calendarId,
      text: this.text,
    })).data;
  },
};
