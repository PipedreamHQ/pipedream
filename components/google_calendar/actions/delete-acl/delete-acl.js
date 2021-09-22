const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_delete_acl",
  name: "Delete Access Control Rule",
  description: "Delete Access Control Rule Metadata of a google calendar.",
  version: "0.0.1",
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
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.acl.delete({
      calendarId: this.calendarId,
      ruleId: this.ruleId,
    })).data;
  },
};
