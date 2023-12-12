import base from "../common/base.mjs";

export default {
  ...base,
  key: "patreon-new-pledge-received",
  name: "New Pledge Received",
  description: "Emit new event for each received pledge",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getTriggerType() {
      return "members:pledge:create";
    },
  },
  async run(event) {
    const id = event.body.data.id;
    const amount = event.body.data.attributes.amount_cents / 100;
    const ts = Date.parse(event.body.data.attributes.date);

    console.log("Emitting event...");

    this.$emit(event.body, {
      id,
      summary: `New pledge: ${amount}`,
      ts,
    });
  },
};
