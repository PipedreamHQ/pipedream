import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-query-free-busy-calendars",
  name: "Retreive Free/Busy Calendar Details",
  description: "Retreive Free/Busy Calendar Details from the user account. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Freebusy.html#query)",
  version: "0.1.0",
  type: "action",
  props: {
    googleCalendar,
  },
  async run({ $ }) {
    const response = await this.googleCalendar.queryFreebusy();

    $.export("$summary", `Successfully retreived free/busy calendar info ${response}`);

    return response;
  },
};
