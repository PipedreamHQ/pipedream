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
      description: "Array of selected email addresses or a comma separated list of email addresses of attendees. (eg. `a@domain.com,b@domain.com`)",
      async options() {
        const { attendees = [] } =
          await this.googleCalendar.getEvent({
            eventId: this.eventId,
            calendarId: this.calendarId,
          });
        return attendees.map(({ email }) => ({
          label: email,
          value: email,
        }));
      },
    },
  },
  async run({ $ }) {
    const { attendees = [] } = this;
    const {
      // eslint-disable-next-line no-unused-vars
      attendees: ignored,
      ...body
    } = await this.googleCalendar.getEvent({
      eventId: this.eventId,
      calendarId: this.calendarId,
    });

    const updatedAttendees =
      Array.isArray(this.attendees)
        ? attendees
        : attendees.split(",");

    const response = await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      requestBody: {
        ...body,
        attendees: updatedAttendees.map((email) => ({
          email: email.trim(),
        })),
      },
    });

    $.export("$summary", `Successfully updated event attendees ${response.id}`);

    return response;
  },
};
