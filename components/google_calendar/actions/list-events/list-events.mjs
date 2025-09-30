import googleCalendar from "../../google_calendar.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "google_calendar-list-events",
  name: "List Events",
  description: "Retrieve a list of event from the Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    iCalUID: {
      propDefinition: [
        googleCalendar,
        "iCalUID",
      ],
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
    orderBy: {
      propDefinition: [
        googleCalendar,
        "orderBy",
      ],
      default: "",
    },
    privateExtendedProperty: {
      propDefinition: [
        googleCalendar,
        "privateExtendedProperty",
      ],
    },
    q: {
      propDefinition: [
        googleCalendar,
        "q",
      ],
    },
    sharedExtendedProperty: {
      propDefinition: [
        googleCalendar,
        "sharedExtendedProperty",
      ],
    },
    showDeleted: {
      propDefinition: [
        googleCalendar,
        "showDeleted",
      ],
    },
    showHiddenInvitations: {
      propDefinition: [
        googleCalendar,
        "showHiddenInvitations",
      ],
    },
    singleEvents: {
      propDefinition: [
        googleCalendar,
        "singleEvents",
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
    updatedMin: {
      propDefinition: [
        googleCalendar,
        "updatedMin",
      ],
    },
    eventTypes: {
      propDefinition: [
        googleCalendar,
        "eventTypes",
      ],
    },
  },
  async run({ $ }) {
    if (this.orderBy === "startTime" && !this.singleEvents) {
      throw new ConfigurationError("Single Events must be `true` to order by `startTime`");
    }

    const args = utils.filterEmptyValues({
      calendarId: this.calendarId,
      iCalUID: this.iCalUID,
      maxAttendees: this.maxAttendees,
      orderBy: this.orderBy || undefined,
      privateExtendedProperty: this.privateExtendedProperty,
      q: this.q,
      sharedExtendedProperty: this.sharedExtendedProperty,
      showDeleted: this.showDeleted,
      showHiddenInvitations: this.showHiddenInvitations,
      singleEvents: this.singleEvents,
      timeMax: this.timeMax,
      timeMin: this.timeMin,
      timeZone: this.timeZone,
      updatedMin: this.updatedMin,
      eventTypes: this.eventTypes,
    });

    const events = [];
    do {
      const {
        items, nextPageToken,
      } = await this.googleCalendar.listEvents(args);
      events.push(...items);
      args.pageToken = nextPageToken;
    } while (args.pageToken && (!this.maxResults || events.length < this.maxResults));
    if (events.length > this.maxResults) {
      events.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${events.length} event${events.length === 1
      ? ""
      : "s"}`);

    return events;
  },
};
