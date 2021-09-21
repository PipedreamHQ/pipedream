const googleCalendar = require("../../google_calendar.app");
const timezones = require("moment-timezone");

module.exports = {
  key: "google_calendar_create_event",
  name: "Create Event",
  description: "Create an event to the Google Calendar.",
  version: "0.0.6",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    summary: {
      label: "Event Title",
      type: "string",
      description: "Enter static text (e.g., `hello world`) for the event name",
    },
    location: {
      label: "Event Venue",
      type: "string",
      description: "Enter static text (e.g., `hello world`) for the event venue",
    },
    description: {
      label: "Event Description",
      type: "string",
      description: "Enter detailed event description",
    },
    attendees: {
      label: "Attendees",
      type: "string[]",
      description: "Enter the EmailId of the attendees",
    },
    eventStartDate: {
      label: "Event Date",
      type: "string",
      description: "Enter the Event day in the format 'yyyy-mm-dd', if this is an all-day event.",
    },
    eventEndDate: {
      label: "Event End Date",
      type: "string",
      description: "Enter the Event day in the format 'yyyy-mm-dd', if this is an all-day event.",
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
      options() {
        const timeZonesList = timezones.tz.names().map((timezone) => {
          return {
            label: timezone,
            value: timezone,
          };
        });

        return timeZonesList;
      },
    },
    // TODO: Should I add reminders
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    /**
     * Format for the attendees
     *
     * [
     *   { "email": "lpage@example.com",},
     *   { "email": "sbrin@example.com",},
     * ]
     */
    const attendees = [];

    /**
     * Based on the IINA Time Zone DB
     * http://www.iana.org/time-zones
     */
    let timeZone = this.timeZone
      ? this.timeZone
      : await calendar.settings.get({
        setting: "timezone",
      }).value;

    if (Array.isArray(this.attendees)) {
      for (let attendee of this.attendees) {
        attendees.push({
          email: attendee,
        });
      }
    }

    const resource = {
      summary: this.summary,
      location: this.location,
      description: this.description,
      start: {
        date: this.eventStartDate,
        timeZone: timeZone,
      },
      end: {
        date: this.eventEndDate,
        timeZone: timeZone,
      },
      attendees,
    };
    return (await calendar.events.insert({
      calendarId: this.calendarId,
      resource,
    })).data;
  },
};
