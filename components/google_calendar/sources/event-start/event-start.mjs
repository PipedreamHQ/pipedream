import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-event-start",
  name: "Event Start",
  description: "Emits a specified time before an event starts",
  version: "0.1.0",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60, // five minutes
      },
    },
  },
  async run(event) {
    const intervalMs = 1000 * (event.interval_seconds || 300); // fall through to default for manual testing
    const now = new Date();

    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + intervalMs).toISOString();

    const config = {
      calendarId: this.calendarId,
      timeMax,
      timeMin,
      singleEvents: true,
      orderBy: "startTime",
    };
    const { items: events } = await this.googleCalendar.listEvents(config);

    if (Array.isArray(events)) {
      for (const event of events) {
        const eventStart = event?.start?.dateTime;
        const start = new Date(eventStart);
        const msFromStart = start.getTime() - now.getTime();
        if (eventStart && msFromStart > 0 && msFromStart < intervalMs) {
          const {
            summary,
            id,
          } = event;
          this.$emit(event, {
            summary,
            id,
            ts: +new Date(event.start.dateTime),
          });
        }
      }
    } else {
      console.log("nothing to emit");
    }
  },
};
