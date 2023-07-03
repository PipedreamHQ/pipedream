import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-event-cancelled",
  // eslint-disable-next-line pipedream/source-name
  name: "Event Cancelled",
  // eslint-disable-next-line pipedream/source-description
  description: "Emits when an event is cancelled or deleted",
  version: "0.1.3",
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
