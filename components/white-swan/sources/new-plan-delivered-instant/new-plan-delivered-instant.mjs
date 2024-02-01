import whiteSwan from "../../white-swan.app.mjs";

export default {
  key: "white-swan-new-plan-delivered-instant",
  name: "New Plan Delivered Instant",
  description: "Emit new event when a plan offer is accepted, delivered, and put into effect for a client you referred.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whiteSwan,
    clientId: {
      propDefinition: [
        whiteSwan,
        "clientId",
      ],
    },
    planDetails: {
      propDefinition: [
        whiteSwan,
        "planDetails",
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
  methods: {
    generateMeta(data) {
      const {
        id, eventTimestamp,
      } = data;
      return {
        id,
        summary: `New plan offer accepted, delivered, and put into effect for client: ${this.clientId}`,
        ts: Date.parse(eventTimestamp),
      };
    },
  },
  hooks: {
    async deploy() {
      // Get the last 50 events
      const events = await this.whiteSwan.getClientInfo({
        clientId: this.clientId,
      });
      for (const event of events.slice(0, 50)) {
        this.$emit(event, {
          id: event.id,
          summary: `New Plan: ${event.planDetails}`,
          ts: Date.parse(event.createdAt),
        });
      }
    },
  },
  async run() {
    const planOfferEvents = await this.whiteSwan.emitPlanOfferEvent({
      clientId: this.clientId,
      planDetails: this.planDetails,
    });

    for (const event of planOfferEvents) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    }
  },
};
