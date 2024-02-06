import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "google_calendar-event-start",
  name: "New Event Start",
  description: "Emit new event when the specified time before the Google Calendar event starts",
  version: "0.1.6",
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
    minutesBefore: {
      type: "integer",
      label: "Minutes Before",
      description: "Emit the event this many minutes before the event starts",
      default: 5,
    },
  },
  methods: {
    ...common.methods,
    getMillisecondsBefore() {
      return +this.minutesBefore * 60 * 1000;
    },
    getConfig({
      now, intervalMs,
    }) {
      const {
        getMillisecondsBefore,
        calendarId,
      } = this;

      const timeMin = new Date(now.getTime() - getMillisecondsBefore()).toISOString();
      const timeMax = new Date(now.getTime() + intervalMs).toISOString();
      return {
        calendarId,
        timeMax,
        timeMin,
        singleEvents: true,
        orderBy: "startTime",
      };
    },
    isRelevant(event, {
      now, intervalMs,
    }) {
      const start = new Date(event?.start?.dateTime);
      const msFromStart = start.getTime() - now.getTime();
      return msFromStart > 0
        && msFromStart < (this.getMillisecondsBefore() + intervalMs);
    },
  },
  sampleEmit,
};
