import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-event-cancelled",
  name: "Event Cancelled",
  description: "Emit new event when a Google Calendar event is cancelled or deleted",
  version: "0.0.3",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  methods: {
    ...common.methods,
    getConfig({
      intervalMs, now,
    }) {
      const updatedMin = new Date(now.getTime() - intervalMs).toISOString();
      return {
        calendarId: this.calendarId,
        updatedMin,
        showDeleted: true,
        singleEvents: true,
        orderBy: "startTime",
      };
    },
    isRelevant(event) {
      return event.status === "cancelled";
    },
  },
};
