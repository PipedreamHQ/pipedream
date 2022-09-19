import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-event-start",
  name: "Event Start",
  description: "Emits a specified time before an event starts",
  version: "0.1.1",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  methods: {
    ...common.methods,
    getConfig({
      intervalMs, now,
    }) {
      const timeMin = now.toISOString();
      const timeMax = new Date(now.getTime() + intervalMs).toISOString();
      return {
        calendarId: this.calendarId,
        timeMax,
        timeMin,
        singleEvents: true,
        orderBy: "startTime",
      };
    },
    isRelevant(event, {
      intervalMs, now,
    }) {
      const eventStart = event?.start?.dateTime;
      const start = new Date(eventStart);
      const msFromStart = start.getTime() - now.getTime();
      return eventStart && msFromStart > 0 && msFromStart < intervalMs;
    },
  },
};
