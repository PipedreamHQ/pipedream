import konfhub from "../../konfhub.app.mjs";

export default {
  key: "konfhub-new-lead-instant",
  name: "New Lead Instant",
  description: "Emits a new event when a new lead is generated for a selected event. [See the documentation](https://docs.konfhub.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    konfhub,
    eventReference: {
      propDefinition: [
        konfhub,
        "eventReference",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Since this is an instant trigger concept, there's no historical data fetching on deploy
    },
    async activate() {
      // This would be used to set up any webhook subscriptions, if applicable
    },
    async deactivate() {
      // This would be used to remove any webhook subscriptions, if applicable
    },
  },
  async run() {
    const eventReference = this.eventReference;
    try {
      const data = await this.konfhub.emitEventForNewLead({
        eventReference,
      });
      this.$emit(data, {
        id: `${eventReference}-${Date.now()}`,
        summary: `New lead for event: ${eventReference}`,
        ts: Date.now(),
      });
    } catch (error) {
      throw new Error(`Failed to emit event for new lead: ${error.message}`);
    }
  },
};
