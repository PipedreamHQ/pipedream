const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_get_calendar",
  name: "Retreive Calendar Details",
  description: "Retreive Calendar details of a Google Calendar.",
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
    return (await calendar.acl.get({
      calendarId: this.calendarId,
      ruleId: this.ruleId,
    })).data;
  },
};
