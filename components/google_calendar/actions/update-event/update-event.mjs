import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_calendar-update-event",
  name: "Update Event",
  description: "Update an existing event in Google Calendar. Only the fields you supply change; recurrence, reminders, attendees and all other fields are kept. Set `Show As` to mark the event as Free or Busy, or `Color ID` to recolor it; for a recurring event this changes the whole series. When only `Color ID` and/or `Show As` are supplied, just your own copy changes and no notifications are sent, so this also works on meetings you don't organize. To add guests without replacing the list, use **Add Attendees To Event**; to change a single occurrence of a recurring event, use **Update Event Instance**. Returns the updated event. See the documentation for [update](https://developers.google.com/workspace/calendar/api/v3/reference/events/update) and [patch](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch)",
  version: "0.2.0",
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
      description: "Enter either an array or a comma separated list of email addresses of attendees, e.g. `alice@example.com,bob@example.com` or `[\"alice@example.com\"]`. Replaces the event's current attendee list; to add attendees without removing existing ones, use **Add Attendees To Event** instead.",
      optional: true,
    },
    colorId: {
      propDefinition: [
        googleCalendar,
        "colorId",
      ],
    },
    transparency: {
      propDefinition: [
        googleCalendar,
        "transparency",
      ],
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
      description: "Configure whether to send notifications about the event. Ignored when only `Color ID` and/or `Show As` are supplied: those change only your copy and never notify guests.",
    },
  },
  methods: {
    ...createEventCommon.methods,
    hasSharedFieldInput() {
      return [
        this.summary,
        this.eventStartDate,
        this.eventEndDate,
        this.location,
        this.description,
        this.parseEmails(this.attendees).length,
        this.repeatFrequency,
        this.repeatInterval,
        this.repeatTimes,
        this.repeatUntil,
        this.repeatSpecificDays?.length,
        this.timeZone,
      ].some(Boolean);
    },
  },
  async run({ $ }) {
    if ((this.colorId || this.transparency) && !this.hasSharedFieldInput()) {
      const response = await this.googleCalendar.patchEvent({
        calendarId: this.calendarId,
        eventId: this.eventId,
        sendUpdates: constants.SEND_UPDATES_NONE,
        requestBody: {
          ...(this.colorId && {
            colorId: this.colorId,
          }),
          ...(this.transparency && {
            transparency: this.transparency,
          }),
        },
      });

      $.export("$summary", `Successfully updated your copy of event: "${response.id}"`);

      return response;
    }

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
      sendUpdates: this.sendUpdates || undefined,
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
        colorId: this.colorId || currentEvent.colorId,
        transparency: this.transparency || currentEvent.transparency,
      },
    });

    $.export("$summary", `Successfully updated event: "${response.id}"`);

    return response;
  },
};
