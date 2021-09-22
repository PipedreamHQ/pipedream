const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_delete_calendar",
  name: "Delete an calendar",
  description: "Delete an calendar from the user account.",
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
    return (await calendar.calendars.delete({
      calendarId: this.calendarId,
    })).data;
  },
};
