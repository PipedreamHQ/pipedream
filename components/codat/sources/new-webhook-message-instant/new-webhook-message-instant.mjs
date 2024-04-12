import codat from "../../codat.app.mjs";

export default {
  key: "codat-new-webhook-message-instant",
  name: "New Webhook Message Instant",
  description: "Emits an event when a specified event type is produced by Codat.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    codat,
    eventType: {
      propDefinition: [
        codat,
        "eventType",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const events = await this.codat.getEvents(this.eventType);
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          summary: `New event: ${event.name}`,
          ts: Date.parse(event.ts),
        });
      }
    },
    async deactivate() {
      console.log("Webhook deactivated");
    },
  },
  async run(event) {
    if (event.headers["Content-Type"] !== "application/json") {
      this.http.respond({
        status: 400,
        body: "Expected application/json",
      });
      return;
    }
    const incomingEventType = event.body.event_type;
    if (incomingEventType !== this.eventType) {
      console.log(`Ignoring event type: ${incomingEventType}`);
      return;
    }
    const eventDetails = await this.codat.getEvents(this.eventType);
    this.$emit(eventDetails, {
      id: eventDetails.id,
      summary: `New ${this.eventType} event`,
      ts: +new Date(),
    });
  },
};
