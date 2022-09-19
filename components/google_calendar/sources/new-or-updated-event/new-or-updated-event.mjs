import common from "../common.mjs";

export default {
  ...common,
  key: "google_calendar-new-or-updated-event",
  name: "New or Updated Event",
  description: "Emits when an event is created or updated (except when it's cancelled)",
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
    isRelevant(event) {
      return event.status !== "cancelled";
    },
    generateMeta(event) {
      const {
        id,
        summary,
        updated: tsString,
      } = event;
      const ts = Date.parse(tsString);
      return {
        id: `${id}-${ts}`,
        summary,
        ts,
      };
    },
  },
};
