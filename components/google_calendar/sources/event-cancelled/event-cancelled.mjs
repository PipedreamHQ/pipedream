import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_calendar-event-cancelled",
  name: "New Cancelled Event",
  description: "Emit new event when a Google Calendar event is cancelled or deleted",
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
