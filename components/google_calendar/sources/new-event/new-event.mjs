import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_calendar-new-event",
  name: "New Event Created",
  description: "Emit new event when a Google Calendar event is created",
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
