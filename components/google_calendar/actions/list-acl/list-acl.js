const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_list_acl_rules",
  name: "Retreive all Access Control Rules",
  description: "Retreive list of Access Control Rules of a google calendar.",
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
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.acl.list({
      calendarId: this.calendarId,
    })).data;
  },
};
