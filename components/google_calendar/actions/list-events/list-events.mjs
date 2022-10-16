import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-list-event",
  name: "List Events",
  description: "Retrieve a list of event from the Google Calendar. [See the docs here](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.0.1",
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
  },
  methods: {
    filterEmptyValues(obj) {
      if (!obj) {
        return obj;
      }
      return Object.entries(obj)
        .reduce((reduction,
          [
            key,
            value,
          ]) => {
          if (value === undefined || value === null) {
            return reduction;
          }
          return {
            ...reduction,
            [key]: value,
          };
        }, {});
    },
  },
  async run({ $ }) {
    const args = this.filterEmptyValues({
      calendarId: this.calendarId,
      iCalUID: this.iCalUID,
      maxAttendees: this.maxAttendees,
      maxResults: this.maxResults,
      orderBy: this.orderBy,
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
    });
    const response = await this.googleCalendar.listEvents(args);

    $.export("$summary", `Successfully retrieved ${response.items.length} event(s)`);

    return response;
  },
};
