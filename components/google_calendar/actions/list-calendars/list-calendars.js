const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_list_calendar",
  name: "List calendars from user account",
  description: "Retreive calendars from the user account.",
  version: "0.0.1",
  type: "action",
  props: {
    googleCalendar,
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.calendarList.list()).data;
  },
};
