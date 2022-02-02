import common from "../common-campaign.mjs";

export default {
  ...common,
  name: "New Campaign Unsubscribe (Instant)",
  key: "activecampaign-new-campaign-unsubscribe",
  description:
    "Emits an event when a contact unsubscribes as a result of a campaign email sent to them.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "unsubscribe",
      ];
    },
  },
};
