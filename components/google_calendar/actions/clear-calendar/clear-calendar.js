const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_clear_calendar",
  name: "Delete all events from a calendar",
  description: "Delete all events from a calendar.",
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
    return (await calendar.calendars.clear({
      calendarId: this.calendarId,
    })).data;
  },
};
