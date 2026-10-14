import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";

export default {
  key: "google_calendar-update-event",
  name: "Update Event",
  description: "Update an existing event in Google Calendar. Only the fields you supply change; recurrence, reminders, attendees and all other fields are kept. To add guests without replacing the list, use **Add Attendees to Event**; to change a single occurrence of a recurring event, use **Update Event Instance**. Returns the updated event. [See the documentation](https://developers.google.com/workspace/calendar/api/v3/reference/events/update)",
  version: "0.0.19",
  ai: "optimized",
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
    ...createEventCommon.props({
      isUpdate: true,
    }),
    attendees: {
      label: "Attendees",
      type: "string",
      description: "Enter either an array or a comma separated list of email addresses of attendees, e.g. `alice@example.com,bob@example.com` or `[\"alice@example.com\"]`. Replaces the event's current attendee list; to add attendees without removing existing ones, use **Add Attendees to Event** instead.",
      optional: true,
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
    },
    sendUpdates: {
      propDefinition: [
        googleCalendar,
        "sendUpdates",
      ],
    },
  },
  methods: {
    ...createEventCommon.methods,
  },
  async run({ $ }) {
    const currentEvent = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
    });

    const timeZone = await this.getTimeZone(this.timeZone || currentEvent.start.timeZone);
    const suppliedAttendees = this.formatAttendees(this.attendees);
    const attendees = suppliedAttendees.length
      ? suppliedAttendees
      : currentEvent.attendees;
    const recurrence = this.formatRecurrence({
      repeatFrequency: this.repeatFrequency,
      repeatInterval: this.repeatInterval,
      repeatTimes: this.repeatTimes,
      repeatUntil: this.repeatUntil,
      repeatSpecificDays: this.repeatSpecificDays,
    });

    const response = await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.eventId,
      sendUpdates: this.sendUpdates,
      // `update` is a full replace; unsupplied fields would be wiped
      requestBody: {
        ...currentEvent,
        summary: this.summary || currentEvent.summary,
        location: this.location || currentEvent.location,
        description: this.description || currentEvent.description,
        start: this.getDateParam({
          date: this.eventStartDate || currentEvent.start.dateTime || currentEvent.start.date,
          timeZone: timeZone || currentEvent.start.timeZone,
        }),
        end: this.getDateParam({
          date: this.eventEndDate || currentEvent.end.dateTime || currentEvent.end.date,
          timeZone: timeZone || currentEvent.end.timeZone,
        }),
        recurrence: recurrence || currentEvent.recurrence,
        attendees,
      },
    });

    $.export("$summary", `Successfully updated event: "${response.id}"`);

    return response;
  },
};
