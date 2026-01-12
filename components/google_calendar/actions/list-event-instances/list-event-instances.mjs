import googleCalendar from "../../google_calendar.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_calendar-list-event-instances",
  name: "List Event Instances",
  description: "Retrieve instances of a recurring event. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/instances)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "The recurring event identifier. Select an event from Google Calendar.",
    },
    maxAttendees: {
      propDefinition: [
        googleCalendar,
        "maxAttendees",
      ],
    },
    maxResults: {
      propDefinition: [
        googleCalendar,
        "maxResults",
      ],
    },
    showDeleted: {
      propDefinition: [
        googleCalendar,
        "showDeleted",
      ],
    },
    timeMax: {
      propDefinition: [
        googleCalendar,
        "timeMax",
      ],
    },
    timeMin: {
      propDefinition: [
        googleCalendar,
        "timeMin",
      ],
    },
    timeZone: {
      propDefinition: [
        googleCalendar,
        "timeZone",
      ],
    },
  },
  async run({ $ }) {
    const args = utils.filterEmptyValues({
      calendarId: this.calendarId,
      eventId: this.eventId,
      maxAttendees: this.maxAttendees,
      showDeleted: this.showDeleted,
      timeMax: this.timeMax,
      timeMin: this.timeMin,
      timeZone: this.timeZone,
    });

    const instances = [];
    do {
      const {
        items, nextPageToken,
      } = await this.googleCalendar.listEventInstances(args);
      instances.push(...items);
      args.pageToken = nextPageToken;
    } while (args.pageToken && (!this.maxResults || instances.length < this.maxResults));
    if (instances.length > this.maxResults) {
      instances.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${instances.length} instance${instances.length === 1
      ? ""
      : "s"} of recurring event`);

    return instances;
  },
};
