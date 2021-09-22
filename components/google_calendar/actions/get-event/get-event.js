const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_get_event",
  name: "Retreive Event Details",
  description: "Retreive event details from the Google Calendar.",
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
    eventId: {
      propDefinition: [
        googleCalendar,
        "eventId",
        (c) => ({
          calendarId: c.calendarId,
        }),
      ],
    },
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.events.get({
      calendarId: this.calendarId,
      eventId: this.eventId,
    })).data;
  },
};
