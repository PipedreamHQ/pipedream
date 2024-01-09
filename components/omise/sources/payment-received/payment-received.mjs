import { axios } from "@pipedream/platform";
import omiseApp from "../../omise.app.mjs";

export default {
  key: "omise-payment-received",
  name: "Payment Received",
  description: "Emits an event for each payment received through the OPN platform.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    omise: {
      type: "app",
      app: "opn_platform",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    status: {
      propDefinition: [
        omiseApp,
        "status",
        () => ({
          status: "successful",
        }),
      ],
    },
  },
  methods: {
    ...omiseApp.methods,
  },
  hooks: {
    async deploy() {
      const charges = await this.omise.listCharges({
        status: "successful",
      });
      const recentCharges = charges.slice(-50).reverse();
      for (const charge of recentCharges) {
        this.$emit(charge, {
          id: charge.id,
          summary: `Payment Received: ${charge.amount} ${charge.currency}`,
          ts: Date.parse(charge.created_at),
        });
      }
      if (recentCharges.length > 0) {
        this.db.set("lastEmittedChargeId", recentCharges[0].id);
      }
    },
  },
  async run() {
    const lastEmittedChargeId = this.db.get("lastEmittedChargeId");
    const charges = await this.omise.listCharges({
      status: "successful",
    });

    for (const charge of charges) {
      if (charge.id !== lastEmittedChargeId) {
        this.$emit(charge, {
          id: charge.id,
          summary: `Payment Received: ${charge.amount} ${charge.currency}`,
          ts: Date.parse(charge.created_at),
        });
      }
    }

    if (charges.length > 0) {
      this.db.set("lastEmittedChargeId", charges[0].id);
    }
  },
};
