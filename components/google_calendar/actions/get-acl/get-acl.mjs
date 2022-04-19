import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-get-acl",
  name: "Retreive Access Control Rule",
  description: "Retreive Access Control Rule Metadata of a google calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Acl.html#get)",
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
    ruleId: {
      propDefinition: [
        googleCalendar,
        "ruleId",
        (c) => ({
          calendarId: c.calendarId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.getAcl({
      calendarId: this.calendarId,
      ruleId: this.ruleId,
    });

    $.export("$summary", `Successfully retreived ACL ${response.id}`);

    return response;
  },
};
