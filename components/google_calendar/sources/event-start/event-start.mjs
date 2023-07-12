import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_calendar-event-start",
  name: "New Event Start",
  description: "Emit new event when the specified time before the Google Calendar event starts",
  version: "0.1.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props({
      useCalendarId: true,
    }),
  },
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
