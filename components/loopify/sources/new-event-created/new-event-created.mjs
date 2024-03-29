import loopify from "../../loopify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "loopify-new-event-created",
  name: "New Event Created",
  description: "Emits a new event when a specified event type occurs in Loopify. [See the documentation](https://api.loopify.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loopify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
    eventType: {
      propDefinition: [
        loopify,
        "eventType",
      ],
    },
  },
  methods: {
    ...loopify.methods,
    _getEventId() {
      return this.db.get("eventId") || 0;
    },
    _setEventId(eventId) {
      this.db.set("eventId", eventId);
    },
    _getTimestamp() {
      return this.db.get("lastEmittedEventTimestamp") || 0;
    },
    _setTimestamp(timestamp) {
      this.db.set("lastEmittedEventTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      // Emit 50 most recent events during the first run
      const events = await this.loopify.emitEvent({
        eventType: this.eventType,
      });
      events.slice(0, 50).forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `New Event: ${event.type}`,
          ts: Date.parse(event.created_at),
        });
      });

      if (events.length > 0) {
        const lastEvent = events[0];
        this._setEventId(lastEvent.id);
        this._setTimestamp(Date.parse(lastEvent.created_at));
      }
    },
  },
  async run() {
    // Get the last emitted event timestamp
    const lastEmittedEventTimestamp = this._getTimestamp();

    // Fetch new events since the last emitted event
    const events = await this.loopify.emitEvent({
      eventType: this.eventType,
      since: lastEmittedEventTimestamp,
    });

    // Emit new events and update the last emitted event timestamp
    events.forEach((event) => {
      const eventTimestamp = Date.parse(event.created_at);
      if (eventTimestamp > lastEmittedEventTimestamp) {
        this.$emit(event, {
          id: event.id,
          summary: `New Event: ${event.type}`,
          ts: eventTimestamp,
        });
        this._setTimestamp(eventTimestamp);
      }
    });
  },
};
