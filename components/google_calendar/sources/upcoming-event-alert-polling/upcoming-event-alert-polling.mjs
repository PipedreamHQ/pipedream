import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "google_calendar-upcoming-event-alert-polling",
  name: "New Upcoming Event Alert (Polling)",
  description: "Emit new event based on a time interval before an upcoming event in the calendar. [See the documentation](https://developers.google.com/calendar/api/v3/reference/events/list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    pollingInfo: {
      type: "alert",
      alertType: "info",
      content: "Since this source executes based on a timer, event emission may be slightly delayed. For example, if the source runs every 5 minutes, the delay may be up to 5 minutes. You can use the `upcoming-event-alert` source for instant event emission.",
    },
    calendarId: {
      propDefinition: [
        common.props.googleCalendar,
        "calendarId",
      ],
    },
    eventTypes: {
      propDefinition: [
        common.props.googleCalendar,
        "eventTypes",
      ],
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
    ...common.methods,
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
    getConfig({ now }) {
      // Get events starting from now up to the alert window
      const timeMin = now.toISOString();
      // Look ahead to find events within our alert window
      const alertWindowMs = this.minutesBefore * 60 * 1000;
      const timeMax = new Date(now.getTime() + alertWindowMs).toISOString();

      return {
        calendarId: this.calendarId,
        timeMin,
        timeMax,
        eventTypes: this.eventTypes,
        singleEvents: true,
        orderBy: "startTime",
      };
    },
    isRelevant(event, { now }) {
      // Skip cancelled events
      if (event.status === "cancelled") {
        return false;
      }

      // Get event start time
      const startTime = event.start
        ? new Date(event.start.dateTime || event.start.date)
        : null;

      if (!startTime) {
        return false;
      }

      // Calculate time remaining until event starts (in milliseconds)
      const timeRemaining = startTime.getTime() - now.getTime();

      // Skip past events
      if (timeRemaining < 0) {
        return false;
      }

      // Convert minutesBefore to milliseconds
      const alertThresholdMs = this.minutesBefore * 60 * 1000;

      // Clean up old emitted events and get the current list
      const emittedEvents = this._cleanupEmittedEvents(now);

      // Check if we've already emitted this event
      if (emittedEvents[event.id]) {
        return false;
      }

      // Emit if time remaining is less than or equal to the alert threshold
      if (timeRemaining <= alertThresholdMs) {
        // Mark this event as emitted with its start time for future cleanup
        emittedEvents[event.id] = startTime.getTime();
        this._setEmittedEvents(emittedEvents);
        return true;
      }

      return false;
    },
    generateMeta(event) {
      const {
        summary,
        id,
      } = event;
      return {
        summary: `Upcoming: ${summary || `Event ID: ${id}`}`,
        id: `${id}-${Date.now()}`,
        ts: Date.now(),
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
  sampleEmit,
};

