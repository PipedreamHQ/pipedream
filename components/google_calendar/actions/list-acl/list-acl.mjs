import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-list-acl-rules",
  name: "Retreive all Access Control Rules",
  description: "Retreive list of Access Control Rules of a google calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Acl.html#list)",
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
    const response = await this.googleCalendar.listAcls({
      calendarId: this.calendarId,
    });

    $.export("$summary", `Successfully retreived ACLs ${response}`);

    return response;
  },
};
