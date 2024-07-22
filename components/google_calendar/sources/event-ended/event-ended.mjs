import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "google_calendar-event-ended",
  name: "New Ended Event",
  description: "Emit new event when a Google Calendar event ends",
  version: "0.1.8",
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
  sampleEmit,
};
