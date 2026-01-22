import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-list-calendars",
  name: "List Calendars",
  description: "Retrieve a list of calendars from Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendarlist.html#list)",
  version: "0.1.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleCalendar,
  },
  async run({ $ }) {
    const { items: calendars } = await this.googleCalendar.listCalendars();

    $.export("$summary", `Successfully retrieved ${calendars.length} calendar${calendars.length === 1
      ? ""
      : "s"}`);

    return calendars;
  },
};
