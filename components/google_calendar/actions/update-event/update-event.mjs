import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";

export default {
  key: "google_calendar-update-event",
  name: "Update Event",
  description: "Update an event from Google Calendar. [See the documentation](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Events.html#update)",
  version: "0.0.15",
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
    const attendees = this.formatAttendees(this.attendees, currentEvent.attendees);
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
      requestBody: {
        summary: this.summary || currentEvent.summary,
        location: this.location || currentEvent.location,
        description: this.description || currentEvent.description,
        start: this.getDateParam({
          date: this.eventStartDate || currentEvent.start.dateTime || currentEvent.start.date,
          timeZone: timeZone || currentEvent.start.timeZone,
        }),
        end: this.getDateParam({
          date: this.eventEndDate || currentEvent.end.dateTime || currentEvent.start.date,
          timeZone: timeZone || currentEvent.end.timeZone,
        }),
        recurrence,
        attendees,
      },
    });

    $.export("$summary", `Successfully updated event: "${response.id}"`);

    return response;
  },
};
