import googleCalendar from "../../google_calendar.app.mjs";
import createEventCommon from "../common/create-event-common.mjs";

export default {
  key: "google_calendar-update-event-instance",
  name: "Update Event Instance",
  description: "Update a single occurrence of a recurring event. Changes apply only to that instance and only the fields you supply change; reminders, attendees and all other fields are kept. Set `Show As` to mark the instance as Free or Busy. Use **List Event Instances** to find the instance, or **Update Event** to change the whole series. Returns the updated instance. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/update)",
  version: "0.1.0",
  ai: "optimized",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    recurringEventId: {
      propDefinition: [
        googleCalendar,
        "recurringEventId",
        ({ calendarId }) => ({
          calendarId,
        }),
      ],
    },
    instanceId: {
      propDefinition: [
        googleCalendar,
        "instanceId",
        ({
          calendarId,
          recurringEventId,
        }) => ({
          calendarId,
          recurringEventId,
        }),
      ],
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter a new title for this instance",
      optional: true,
    },
    eventStartDate: {
      label: "Event Start Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
      optional: true,
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
      optional: true,
    },
    location: {
      label: "Event Location",
      type: "string",
      description: "Specify a new location for this instance",
      optional: true,
    },
    description: {
      label: "Event Description",
      type: "string",
      description: "Enter a new description for this instance",
      optional: true,
    },
    attendees: {
      label: "Attendees",
      type: "string",
      description: "Enter either an array or a comma separated list of email addresses of attendees, e.g. `alice@example.com,bob@example.com` or `[\"alice@example.com\"]`. Replaces the instance's current attendee list; to add attendees without removing existing ones, use **Add Attendees to Event** instead.",
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
    },
  },
  methods: createEventCommon.methods,
  async run({ $ }) {
    const currentEvent = await this.googleCalendar.getEvent({
      calendarId: this.calendarId,
      eventId: this.instanceId,
    });

    const timeZone = await this.getTimeZone(this.timeZone || currentEvent.start.timeZone);
    const suppliedAttendees = this.formatAttendees(this.attendees);
    const attendees = suppliedAttendees.length
      ? suppliedAttendees
      : currentEvent.attendees;

    const response = await this.googleCalendar.updateEvent({
      calendarId: this.calendarId,
      eventId: this.instanceId,
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
        attendees,
        colorId: this.colorId || currentEvent.colorId,
        transparency: this.transparency || currentEvent.transparency,
      },
    });

    $.export("$summary", `Successfully updated event instance \`${response.id}\``);

    return response;
  },
};
