const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_update_event_attendees",
  name: "Update attendees of an event",
  description: "Update attendees of an existing event.",
  version: "0.0.3",
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
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "Add EmailId's of the attendees",
      async options() {
        const calendar = this.googleCalendar.calendar();
        const { data } = await calendar.events.get({
          eventId: this.eventId,
          calendarId: this.calendarId,
        });
        const attendees = data.attendees
          ? data.attendees
          : [];

        const options = attendees.map((attendee) => {
          return {
            label: attendee.email,
            value: attendee.email,
          };
        });

        return options;
      },
    },
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    const { data } = await calendar.events.get({
      eventId: this.eventId,
      calendarId: this.calendarId,
    });
    let attendees = this.attendees
      ? this.attendees
      : [];
    attendees = attendees.map( (attendee) => {
      return {
        email: attendee,
      };
    });
    return (await calendar.events.update({
      calendarId: this.calendarId,
      eventId: this.eventId,
      requestBody: {
        ...data,
        attendees,
      },
    })).data;
  },
};
