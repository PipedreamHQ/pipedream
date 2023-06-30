import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-list-calendars",
  name: "List calendars from user account",
  description: "Retrieve calendars from the user account. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendarlist.html#list)",
  version: "0.1.2",
  type: "action",
  props: {
    googleCalendar,
  },
  async run({ $ }) {
    const { items: calendars } = await this.googleCalendar.listCalendars();

    $.export("$summary", `Successfully listed ${calendars.length} calendars`);

    return calendars;
  },
};
