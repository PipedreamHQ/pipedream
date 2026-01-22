import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_calendar-new-event-search",
  name: "New Event Matching a Search",
  description: "Emit new event when a Google Calendar event is created that matches a search",
  version: "0.1.12",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    calendarId: {
      propDefinition: [
        common.props.googleCalendar,
        "calendarId",
      ],
    },
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
      // created since last run and not cancelled
      return created > past && event.status !== "cancelled";
    },
  },
};
