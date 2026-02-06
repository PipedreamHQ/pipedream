import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-new-upcoming-event-polling",
  name: "New Upcoming Calendar Event (Polling)",
  description: "Emit new event based on a time interval before an upcoming calendar event. [See the documentation](https://docs.microsoft.com/en-us/graph/api/user-list-events)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    microsoftOutlook,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    pollingInfo: {
      type: "alert",
      alertType: "info",
      content: "Since this source executes based on a timer, event emission may be slightly delayed. For example, if the source runs every 5 minutes, the delay may be up to 5 minutes. You can use the `new-upcoming-event` source for instant event emission.",
    },
    minutesBefore: {
      type: "integer",
      label: "Minutes Before",
      description: "Number of minutes to trigger before the start of the calendar event.",
      min: 0,
      default: 30,
    },
  },
  methods: {
    _getEmittedEvents() {
      return this.db.get("emittedEvents") || {};
    },
    _setEmittedEvents(emittedEvents) {
      this.db.set("emittedEvents", emittedEvents);
    },
    _cleanupEmittedEvents(now) {
      const emittedEvents = this._getEmittedEvents();
      const cleanedEvents = {};
      let cleanedCount = 0;

      // Keep only events that haven't passed yet
      for (const [
        eventId,
        startTime,
      ] of Object.entries(emittedEvents)) {
        if (startTime > now.getTime()) {
          cleanedEvents[eventId] = startTime;
        } else {
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} past event(s) from emitted events tracker`);
        this._setEmittedEvents(cleanedEvents);
      }

      return cleanedEvents;
    },
    generateMeta(event) {
      const ts = event.start?.dateTime
        ? Date.parse(event.start.dateTime)
        : Date.now();
      return {
        id: `${event.uid}-${ts}`,
        summary: `Upcoming: ${event.subject || "(untitled)"}`,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      // On initial deploy, don't emit historical events
      // Just initialize the emitted events tracker
      this._setEmittedEvents({});
    },
  },
  async run() {
    const now = new Date();
    const alertWindowMs = this.minutesBefore * 60 * 1000;
    const timeMax = new Date(now.getTime() + alertWindowMs).toISOString();

    // Clean up old emitted events
    const emittedEvents = this._cleanupEmittedEvents(now);

    // Fetch events within the alert window
    const { value: events } = await this.microsoftOutlook.listCalendarView({
      params: {
        startDateTime: now.toISOString(),
        endDateTime: timeMax,
        $orderby: "start/dateTime",
      },
    });

    if (!events || events.length === 0) {
      console.log("No upcoming events found in the alert window");
      return;
    }

    for (const event of events) {
      // Skip if already emitted
      if (emittedEvents[event.uid]) {
        continue;
      }

      const startTime = event.start
        ? new Date(event.start.dateTime)
        : null;

      if (!startTime) {
        continue;
      }

      const timeRemaining = startTime.getTime() - now.getTime();
      if (timeRemaining < 0) {
        continue;
      }

      const alertThresholdMs = this.minutesBefore * 60 * 1000;

      // Emit if time remaining is less than or equal to the alert threshold
      if (timeRemaining <= alertThresholdMs) {
        emittedEvents[event.uid] = startTime.getTime();

        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    }

    this._setEmittedEvents(emittedEvents);
  },
};

