import common from "../common/common.mjs";

export default {
  ...common,
  key: "raisely-donation-refunded",
  name: "Donation Refunded (Instant)",
  description: "Emit new event when a donation has been refunded.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "donation.refunded";
    },
    generateMeta() {

    },
  },
};
