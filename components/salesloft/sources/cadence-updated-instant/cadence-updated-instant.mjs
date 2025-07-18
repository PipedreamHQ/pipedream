import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesloft-cadence-updated-instant",
  name: "Cadence Updated (Instant)",
  description: "Emit new event when a cadence is updated in Salesloft. [See the documentation](https://developers.salesloft.com/docs/api/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "cadence_updated";
    },
    getSummary(data) {
      return `Cadence updated: ${data.name || data.id}`;
    },
  },
};
