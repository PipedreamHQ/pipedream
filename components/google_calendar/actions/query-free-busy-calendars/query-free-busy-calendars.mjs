import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-query-free-busy-calendars",
  name: "Retrieve Free/Busy Calendar Details",
  description: "Retrieve free/busy calendar details from Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Freebusy.html#query)",
  version: "0.1.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
      optional: false,
      description: "Select a calendar to retrieve free/busy details",
    },
    timeMin: {
      propDefinition: [
        googleCalendar,
        "timeMin",
      ],
      optional: false,
    },
    timeMax: {
      propDefinition: [
        googleCalendar,
        "timeMax",
      ],
      optional: false,
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
      description: "Specify the preferred time zone to be used on the response",
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.queryFreeBusy({
      requestBody: {
        timeMin: this.timeMin,
        timeMax: this.timeMax,
        timeZone: this.timeZone,
        items: [
          {
            id: this.calendarId,
          },
        ],
      },
    });

    $.export("$summary", `Successfully retrieved free/busy calendar details from ${this.timeMin} to ${this.timeMax}`);

    return response;
  },
};
