import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-new-event",
  name: "New Event",
  description: "Emits when an event is created",
  version: "0.1.1",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  methods: {
    ...common.methods,
    getConfig({ past }) {
      const updatedMin = past.toISOString();
      return {
        calendarId: this.calendarId,
        updatedMin,
        singleEvents: true,
        orderBy: "startTime",
      };
    },
    isRelevant(event, { past }) {
      const created = new Date(event.created);
      return created > past && event.status !== "cancelled";
    },
  },
};
