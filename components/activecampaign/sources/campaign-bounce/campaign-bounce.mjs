import common from "../common/campaign.mjs";

export default {
  ...common,
  name: "New Campaign Bounce (Instant)",
  key: "activecampaign-campaign-bounce",
  description:
    "Emits an event when a contact email address bounces from a sent campaign.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "bounce",
      ];
    },
  },
};
