import konfhub from "../../konfhub.app.mjs";

export default {
  key: "konfhub-new-registration-cancelled-instant",
  name: "New Registration Cancelled Instant",
  description: "Emits an event when a registration is cancelled for a selected event.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    konfhub,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    eventReference: {
      propDefinition: [
        konfhub,
        "eventReference",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit up to 50 events, from most recent to least recent
      const lastEmitted = this.db.get("lastEmitted") || 0;
      const response = await this.konfhub.emitEventForRegistrationCancellation({
        eventReference: this.eventReference,
      });
      const eventsToEmit = response.filter((event) => event.timestamp > lastEmitted).slice(0, 50)
        .reverse();
      for (const event of eventsToEmit) {
        this.$emit(event, {
          id: event.id || `${event.timestamp}`,
          summary: `Registration cancelled for event reference: ${this.eventReference}`,
          ts: event.timestamp,
        });
      }
      if (eventsToEmit.length > 0) {
        this.db.set("lastEmitted", eventsToEmit[0].timestamp);
      }
    },
  },
  async run() {
    const lastEmitted = this.db.get("lastEmitted") || 0;
    const response = await this.konfhub.emitEventForRegistrationCancellation({
      eventReference: this.eventReference,
    });
    // Assuming the response is an array of cancellations; adjust based on actual API response
    const newCancellations = response.filter((event) => event.timestamp > lastEmitted);
    for (const cancellation of newCancellations) {
      this.$emit(cancellation, {
        id: cancellation.id || `${cancellation.timestamp}`,
        summary: `Registration cancelled: ${cancellation.id}`,
        ts: cancellation.timestamp,
      });
    }
    if (newCancellations.length > 0) {
      this.db.set("lastEmitted", newCancellations[0].timestamp);
    }
  },
};
