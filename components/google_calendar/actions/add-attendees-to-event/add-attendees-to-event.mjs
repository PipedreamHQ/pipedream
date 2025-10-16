import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";

export default {
  key: "google_calendar-add-attendees-to-event",
  name: "Add Attendees To Event",
  description: "Add attendees to an existing event. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#update)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "Attendees",
      type: "string",
      description: "Enter either an array or a comma separated list of email addresses of attendees",
    },
    sendUpdates: {
      propDefinition: [
        googleCalendar,
        "sendUpdates",
      ],
    },
  },
  async run({ $ }) {
    const updatedAttendees = createEventCommon.methods.formatAttendees(this.attendees);
    const currentEvent = await this.googleCalendar.getEvent({
      eventId: this.eventId,
      calendarId: this.calendarId,
    });
    if (currentEvent?.attendees && currentEvent.attendees.length) {
      updatedAttendees.push(...currentEvent.attendees);
    }
    const response = await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      sendUpdates: this.sendUpdates,
      requestBody: {
        ...currentEvent,
        attendees: updatedAttendees,
      },
    });

    $.export("$summary", `Successfully updated event attendees: "${response.id}"`);
    return response;
  },
};
