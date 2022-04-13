import common from "../common/campaign.mjs";

export default {
  ...common,
  name: "Campaign Opened (Instant)",
  key: "activecampaign-campaign-opened",
  description:
    "Emit new event when a contact opens a campaign (will trigger once per contact per campaign).",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "open",
      ];
    },
  },
};
