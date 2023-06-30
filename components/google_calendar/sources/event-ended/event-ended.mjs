import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-event-ended",
  // eslint-disable-next-line pipedream/source-name
  name: "Event Ended",
  // eslint-disable-next-line pipedream/source-description
  description: "Emits when an event ends",
  version: "0.1.3",
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
