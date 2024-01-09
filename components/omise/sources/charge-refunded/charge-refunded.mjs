import { axios } from "@pipedream/platform";
import omiseApp from "../../omise.app.mjs";

export default {
  key: "omise-charge-refunded",
  name: "Charge Refunded",
  description: "Emits an event for each refunded charge through the OPN platform. [See the documentation](https://docs.opn.ooo/charges-api)",
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
        (c) => ({
          status: "refunded",
        }),
      ],
    },
  },
  methods: {
    _getLatestTimestamp() {
      return this.db.get("latestTimestamp") ?? 0;
    },
    _setLatestTimestamp(timestamp) {
      this.db.set("latestTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const refundedCharges = await this.omise.listCharges({
        status: "refunded",
      });
      const sortedCharges = refundedCharges.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const latestCharges = sortedCharges.slice(0, 50);

      for (const charge of latestCharges) {
        this.$emit(charge, {
          id: charge.id,
          summary: `Charge ${charge.id} refunded`,
          ts: Date.parse(charge.created_at),
        });
      }

      if (latestCharges.length > 0) {
        const latestTimestamp = Date.parse(latestCharges[0].created_at);
        this._setLatestTimestamp(latestTimestamp);
      }
    },
  },
  async run() {
    const latestTimestamp = this._getLatestTimestamp();
    const refundedCharges = await this.omise.listCharges({
      status: "refunded",
    });

    for (const charge of refundedCharges) {
      const chargeTimestamp = Date.parse(charge.created_at);
      if (chargeTimestamp > latestTimestamp) {
        this.$emit(charge, {
          id: charge.id,
          summary: `Charge ${charge.id} refunded`,
          ts: chargeTimestamp,
        });
        this._setLatestTimestamp(chargeTimestamp);
      }
    }
  },
};
