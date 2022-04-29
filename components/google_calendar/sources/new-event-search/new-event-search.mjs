import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-new-event-search",
  name: "Event Search",
  description: "Emit when an event is created that matches a search",
  version: "0.1.0",
  type: "source",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  props: {
    googleCalendar,
    q: {
      propDefinition: [
        googleCalendar,
        "q",
      ],
    },
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
    const past = new Date(now.getTime() - intervalMs);

    const updatedMin = past.toISOString();

    const config = {
      calendarId: this.calendarId,
      updatedMin,
      q: this.q,
      singleEvents: true,
      orderBy: "startTime",
    };
    const { items: events } = await this.googleCalendar.listEvents(config);

    if (Array.isArray(events)) {
      for (const event of events) {
        const created = new Date(event.created);
        // created in last 5 mins and not cancelled
        if (created > past && event.status !== "cancelled") {
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
