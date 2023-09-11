import common from "../common/common.mjs";

export default {
  ...common,
  key: "raisely-donation-succeeded",
  name: "Donation Succeeded (Instant)",
  description: "Emit new event when a donation has succeeded.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "donation.succeeded";
    },
    generateMeta() {

    },
  },
};
