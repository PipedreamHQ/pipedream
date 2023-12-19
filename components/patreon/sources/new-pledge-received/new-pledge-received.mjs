import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "patreon-new-pledge-received",
  name: "New Pledge Received",
  description: "Emit new event for each received pledge",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getTriggerType() {
      return "members:pledge:create";
    },
  },
  async run(event) {
    const id = event.body.data.id || Date.now();
    const amount = event.body.data.attributes.campaign_pledge_amount_cents / 100;
    const ts = Date.parse(event.body.data.attributes.last_charge_date);

    console.log("Emitting event...");

    this.$emit(event.body, {
      id,
      summary: `New pledge: ${amount}`,
      ts,
    });
  },
  sampleEmit,
};
