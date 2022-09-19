import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-event-ended",
  name: "Event Ended",
  description: "Emits when an event ends",
  version: "0.1.1",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  methods: {
    ...common.methods,
    getConfig({
      intervalMs, now,
    }) {
      const timeMin = new Date(now.getTime() - intervalMs).toISOString();
      const timeMax = new Date(now.getTime()).toISOString();
      return {
        calendarId: this.calendarId,
        timeMax,
        timeMin,
        singleEvents: true,
        orderBy: this.orderBy,
      };
    },
    isRelevant(event, {
      intervalMs, now,
    }) {
      const eventEnd = event?.end?.dateTime;
      const end = new Date(eventEnd);
      const msFromEnd = now.getTime() - end.getTime();
      return eventEnd && msFromEnd > 0 && msFromEnd < intervalMs;
    },
  },
};
