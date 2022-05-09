import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-query-free-busy-calendars",
  name: "Retreive Free/Busy Calendar Details",
  description: "Retreive Free/Busy Calendar Details from the user account. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Freebusy.html#query)",
  version: "0.1.0",
  type: "action",
  props: {
    googleCalendar,
    timeMin: {
      type: "string",
      label: "Time Min",
      description: "The start of the interval for the query formatted as per RFC3339. (eg. `2022-02-20T19:27:40Z`)",
    },
    timeMax: {
      type: "string",
      label: "Time Max",
      description: "The end of the interval for the query formatted as per RFC3339. (eg. `2022-04-20T19:27:40Z`)",
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.queryFreebusy({
      requestBody: {
        timeMin: this.timeMin,
        timeMax: this.timeMax,
      },
    });

    $.export("$summary", "Successfully retreived free/busy calendar info");

    return response;
  },
};
