import common from "../common/campaign.mjs";

export default {
  ...common,
  name: "New Campaign Link Clicked (Instant)",
  key: "activecampaign-campaign-link-clicked",
  description:
    "Emit new event when a link from a campaign is clicked (will only run once for each unique link).",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "click",
      ];
    },
  },
};
