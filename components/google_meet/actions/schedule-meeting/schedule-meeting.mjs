import googleMeet from "../../google_meet.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "google_meet-schedule-meeting",
  name: "Schedule Meeting",
  description: "Creates a new event in Google Calendar with a Google Meet link. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/insert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleMeet,
    calendarId: {
      propDefinition: [
        googleMeet,
        "calendarId",
      ],
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter a title for the event, (e.g., `My event`)",
      optional: true,
    },
    location: {
      label: "Event Location",
      type: "string",
      description: "Specify the location of the event",
      optional: true,
    },
    description: {
      label: "Event Description",
      type: "string",
      description: "Enter a description for the event",
      optional: true,
    },
    attendees: {
      label: "Attendees",
      type: "string[]",
      description: "Enter an array of email addresses for any attendees",
      optional: true,
    },
    eventStartDate: {
      label: "Event Start Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "For all-day events, enter the Event day in the format `yyyy-mm-dd`. For events with time, format according to [RFC3339](https://www.rfc-editor.org/rfc/rfc3339.html#section-1): `yyyy-mm-ddThh:mm:ss+01:00`. A time zone offset is required unless a time zone is explicitly specified in timeZone.",
    },
    recurrence: {
      label: "Recurrence",
      type: "string[]",
      description: "Recurrence rule(s) for the event. For example, `RRULE:FREQ=DAILY;INTERVAL=2` means once every two days, `RRULE:FREQ=YEARLY` means annually.\nYou can combine multiple recurrence rules. [See the documentation](https://developers.google.com/calendar/api/concepts/events-calendars#recurrence_rule)",
      optional: true,
    },
    timeZone: {
      propDefinition: [
        googleMeet,
        "timeZone",
      ],
    },
    sendUpdates: {
      propDefinition: [
        googleMeet,
        "sendUpdates",
      ],
    },
    sendNotifications: {
      propDefinition: [
        googleMeet,
        "sendNotifications",
      ],
    },
    colorId: {
      propDefinition: [
        googleMeet,
        "colorId",
      ],
    },
  },
  methods: {
    async getTimeZone(selectedTimeZone) {
      const { value: timeZone } = selectedTimeZone ?? await this.googleMeet.getSettings({
        setting: "timezone",
      });
      return timeZone;
    },
    formatAttendees(selectedAttendees, currentAttendees) {
      let attendees = [];
      if (selectedAttendees && Array.isArray(selectedAttendees)) {
        attendees = selectedAttendees.map((email) => ({
          email,
        }));
      } else if (currentAttendees && Array.isArray(currentAttendees)) {
        return currentAttendees.map((attendee) => ({
          email: attendee.email,
        }));
      }
      return attendees;
    },
    checkDateOrDateTimeInput(date, type) {
      if (type === "date") {
        return date && date.length <= 10
          ? date
          : undefined;
      }
      if (type === "dateTime") {
        return date && date.length > 10
          ? date
          : undefined;
      }
    },
    getDateParam({
      date,
      timeZone,
    }) {
      return {
        date: this.checkDateOrDateTimeInput(date, "date"),
        dateTime: this.checkDateOrDateTimeInput(date, "dateTime"),
        timeZone,
      };
    },
  },
  async run({ $ }) {
    const timeZone = await this.getTimeZone(this.timeZone);
    const attendees = this.formatAttendees(this.attendees);

    const data = {
      calendarId: this.calendarId,
      sendUpdates: this.sendUpdates,
      sendNotifications: this.sendNotifications,
      resource: {
        summary: this.summary,
        location: this.location,
        description: this.description,
        start: this.getDateParam({
          date: this.eventStartDate,
          timeZone,
        }),
        end: this.getDateParam({
          date: this.eventEndDate,
          timeZone,
        }),
        recurrence: this.recurrence,
        attendees,
        colorId: this.colorId,
        conferenceData: {
          createRequest: {
            requestId: uuidv4(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
      conferenceDataVersion: 1,
    };

    const response = await this.googleMeet.createEvent(data);

    $.export("$summary", `Successfully created event: "${response.id}"`);

    return response;
  },
};
