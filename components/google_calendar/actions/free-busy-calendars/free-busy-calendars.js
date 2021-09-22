const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_free_busy_calendar_info",
  name: "Retreive Free/Busy Calendar Details",
  description: "Retreive Free/Busy Calendar Details from the user account.",
  version: "0.0.1",
  type: "action",
  props: {
    googleCalendar,
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.freebusy.freebusy()).data;
  },
};
