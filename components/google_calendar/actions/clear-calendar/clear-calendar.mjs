import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-clear-calendar",
  name: "Delete all events from a calendar",
  description: "Delete all events from a calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendars.html#clear)",
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
  },
  async run({ $ }) {
    const response = await this.googleCalendar.clearCalendar({
      calendarId: this.calendarId,
    });

    $.export("$summary", `Successfully cleared calendar ${response}`);

    return response;
  },
};
