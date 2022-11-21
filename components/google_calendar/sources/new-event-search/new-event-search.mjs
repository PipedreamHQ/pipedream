import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-new-event-search",
  name: "Event Search",
  description: "Emit when an event is created that matches a search",
  version: "0.1.2",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  props: {
    ...common.props,
    q: {
      propDefinition: [
        common.props.googleCalendar,
        "q",
      ],
    },
  },
  methods: {
    ...common.methods,
    getConfig({ past }) {
      const updatedMin = past.toISOString();
      return {
        calendarId: this.calendarId,
        updatedMin,
        q: this.q,
        singleEvents: true,
        orderBy: "startTime",
      };
    },
    isRelevant(event, { past }) {
      const created = new Date(event.created);
      // created in last 5 mins and not cancelled
      return created > past && event.status !== "cancelled";
    },
  },
};
