import common from "../common/campaign.mjs";

export default {
  ...common,
  name: "New Campaign Bounce (Instant)",
  key: "activecampaign-campaign-bounce",
  description:
    "Emit new event when a contact email address bounces from a sent campaign.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "bounce",
      ];
    },
  },
};
