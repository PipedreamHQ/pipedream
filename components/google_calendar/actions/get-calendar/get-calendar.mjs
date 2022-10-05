import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-get-calendar",
  name: "Retrieve Calendar Details",
  description: "Retrieve Calendar details of a Google Calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendars.html#get)",
  version: "0.1.1",
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
    const response = await this.googleCalendar.getCalendar({
      calendarId: this.calendarId,
    });

    $.export("$summary", `Successfully retrieved calendar ${response.id}`);

    return response;
  },
};
