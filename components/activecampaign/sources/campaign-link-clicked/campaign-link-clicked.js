const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-campaign.js");

module.exports = {
  ...common,
  name: "Campaign Link Clicked (Instant)",
  key: "activecampaign-campaign-link-clicked",
  description:
    "Emits an event when a link from a campaign is clicked (will only run once for each unique link).",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["click"];
    },
  },
};