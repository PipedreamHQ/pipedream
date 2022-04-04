import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-update-event-attendees",
  name: "Update attendees of an event",
  description: "Update attendees of an existing event. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#update)",
  version: "0.1.0",
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
        const { attendees = [] } = await this.googleCalendar.getEvent({
          eventId: this.eventId,
          calendarId: this.calendarId,
        });

        return attendees.map((email) => ({
          label: email,
          value: email,
        }));
      },
    },
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      attendees,
      ...data
    } = await this.googleCalendar.getEvent({
      eventId: this.eventId,
      calendarId: this.calendarId,
    });

    const response = await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      requestBody: {
        ...data,
        attendees: this.attendees.map((email) => ({
          email,
        })),
      },
    });

    $.export("$summary", `Successfully updated event attendees ${response.id}`);

    return response;
  },
};
