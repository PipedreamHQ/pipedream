import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_calendar-new-event",
  name: "New Event Created",
  description: "Emit new event when a Google Calendar event is created",
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
    isRelevant(event, { past }) {
      const created = new Date(event.created);
      return created > past && event.status !== "cancelled";
    },
  },
};
