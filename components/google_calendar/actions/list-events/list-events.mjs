import googleCalendar from "../../google_calendar.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_calendar-list-events",
  name: "List Events",
  description: "Retrieve a list of event from the Google Calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.0.5",
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
    pageToken: {
      propDefinition: [
        googleCalendar,
        "pageToken",
      ],
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
    syncToken: {
      propDefinition: [
        googleCalendar,
        "syncToken",
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
    const args = utils.filterEmptyValues({
      calendarId: this.calendarId,
      iCalUID: this.iCalUID,
      maxAttendees: this.maxAttendees,
      maxResults: this.maxResults,
      orderBy: this.orderBy || undefined,
      pageToken: this.pageToken,
      privateExtendedProperty: this.privateExtendedProperty,
      q: this.q,
      sharedExtendedProperty: this.sharedExtendedProperty,
      showDeleted: this.showDeleted,
      showHiddenInvitations: this.showHiddenInvitations,
      singleEvents: this.singleEvents,
      syncToken: this.syncToken,
      timeMax: this.timeMax,
      timeMin: this.timeMin,
      timeZone: this.timeZone,
      updatedMin: this.updatedMin,
      eventTypes: this.eventTypes,
    });
    const response = await this.googleCalendar.listEvents(args);

    $.export("$summary", `Successfully retrieved ${response.items.length} event(s)`);

    return response;
  },
};
