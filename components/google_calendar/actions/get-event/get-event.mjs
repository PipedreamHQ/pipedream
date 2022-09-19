import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-get-event",
  name: "Retreive Event Details",
  description: "Retreive event details from the Google Calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#get)",
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
  },
  async run({ $ }) {
    const response = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
    });

    $.export("$summary", `Successfully retreived event ${response.id}`);

    return response;
  },
};
