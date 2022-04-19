import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-delete-calendar",
  name: "Delete an calendar",
  description: "Delete an calendar from the user account. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendars.html#delete)",
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
    const response = await this.googleCalendar.deleteCalendar({
      calendarId: this.calendarId,
    });

    $.export("$summary", `Successfully deleted calendar ${response}`);

    return response;
  },
};
