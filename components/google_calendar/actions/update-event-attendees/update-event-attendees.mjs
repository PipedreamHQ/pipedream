import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-update-event-attendees",
  name: "Update attendees of an event",
  description: "Update attendees of an existing event. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#update)",
  version: "0.1.2",
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
      propDefinition: [
        googleCalendar,
        "attendeesFromEvent",
        (c) => ({
          calendarId: c.calendarId,
          eventId: c.eventId,
        }),
      ],
    },
    sendUpdates: {
      propDefinition: [
        googleCalendar,
        "sendUpdates",
      ],
    },
    sendNotifications: {
      propDefinition: [
        googleCalendar,
        "sendNotifications",
      ],
    },
  },
  methods: {
    formatAttendees(attendees) {
      const updatedAttendees = (
        attendees && Array.isArray(attendees)
          ? attendees
          : attendees?.split(",") || []
      );
      return updatedAttendees.map((email) => ({
        email: email.trim(),
      }));
    },
  },
  async run({ $ }) {
    const updatedAttendees = this.formatAttendees(this.attendees);
    const currentEvent = await this.googleCalendar.getEvent({
      eventId: this.eventId,
      calendarId: this.calendarId,
    });
    const response = await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      sendUpdates: this.sendUpdates,
      sendNotifications: this.sendNotifications,
      requestBody: {
        ...currentEvent,
        attendees: updatedAttendees,
      },
    });

    $.export("$summary", `Successfully updated event attendees: "${response.id}"`);
    return response;
  },
};
