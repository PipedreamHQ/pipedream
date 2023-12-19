import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-new-calendar-subscriber",
  name: "New Calendar Subscriber",
  description: "Emits an event when a new subscriber is created on a calendar.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    addevent,
    calendarId: {
      propDefinition: [
        addevent,
        "calendarId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Get all subscribers
      const subscribers = await this.addevent.listSubscribers(this.calendarId);
      // Emit the subscribers found during deploy
      for (const subscriber of subscribers) {
        this.$emit(subscriber, {
          id: subscriber.id,
          summary: `New subscriber: ${subscriber.email}`,
          ts: Date.now(),
        });
      }
    },
  },
  methods: {
    ...addevent.methods,
    async listSubscribers(calendarId) {
      return this._makeRequest({
        path: `/calendars/${calendarId}/subscribers`,
      });
    },
  },
  async run() {
    // Get all subscribers
    const subscribers = await this.listSubscribers(this.calendarId);
    // Emit each subscriber
    for (const subscriber of subscribers) {
      this.$emit(subscriber, {
        id: subscriber.id,
        summary: `New subscriber: ${subscriber.email}`,
        ts: Date.now(),
      });
    }
  },
};
