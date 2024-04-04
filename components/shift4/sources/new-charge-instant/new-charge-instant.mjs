import shift4 from "../../shift4.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shift4-new-charge-instant",
  name: "New Charge Instant",
  description: "Emits an event when a new charge is successfully created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    shift4: {
      type: "app",
      app: "shift4",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const charges = await this.shift4.listCharges({
        type: "charge_succeeded",
      });
      charges.forEach((charge) => {
        this.$emit(charge, {
          id: charge.id,
          summary: `New charge: ${charge.amount}`,
          ts: Date.parse(charge.created),
        });
      });
    },
  },
  async run(event) {
    const body = event.body;
    if (body.type === "charge_succeeded") {
      this.$emit(body.data, {
        id: body.data.id,
        summary: `Charge succeeded: ${body.data.amount}`,
        ts: Date.parse(body.data.created),
      });
    } else {
      this.http.respond({
        status: 200,
        body: "Event type is not 'charge_succeeded'",
      });
    }
  },
  methods: {
    async listCharges({ type }) {
      return this.shift4.createCharge({
        type,
      });
    },
  },
};
