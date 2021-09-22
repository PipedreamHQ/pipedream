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
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.calendars.get({
      calendarId: this.calendarId,
    })).data;
  },
};
