import whiteSwanApp from "../../white-swan.app.mjs";

export default {
  key: "white-swan-new-plan-change-request-instant",
  name: "New Plan Change Request Instant",
  description: "Emits a new event when a customer submits a change request for a personal plan.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whiteSwan: {
      type: "app",
      app: "white_swan",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    clientId: {
      propDefinition: [
        whiteSwanApp,
        "clientId",
      ],
    },
    planDetails: {
      propDefinition: [
        whiteSwanApp,
        "planDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit all existing plan change requests
      const existingRequests = await this.whiteSwan.emitChangeRequest({
        clientId: this.clientId,
        planDetails: this.planDetails,
      });

      for (const request of existingRequests) {
        this.$emit(request, this.generateMeta(request));
      }
    },
  },
  methods: {
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: data.clientId,
        summary: `New plan change request from client ${data.clientId}`,
        ts,
      };
    },
  },
  async run() {
    // Check for new plan change requests
    const newRequests = await this.whiteSwan.emitChangeRequest({
      clientId: this.clientId,
      planDetails: this.planDetails,
    });

    for (const request of newRequests) {
      this.$emit(request, this.generateMeta(request));
    }
  },
};
