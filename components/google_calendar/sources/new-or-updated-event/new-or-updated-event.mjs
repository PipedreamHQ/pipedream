import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_calendar-new-or-updated-event",
  name: "New Created or Updated Event",
  description: "Emit new event when a Google Calendar events is created or updated (does not emit cancelled events)",
  version: "0.1.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    calendarId: {
      propDefinition: [
        common.props.googleCalendar,
        "calendarId",
      ],
    },
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
