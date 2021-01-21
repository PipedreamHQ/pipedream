const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-campaign.js");

module.exports = {
  ...common,
  name: "Campaign Opened (Instant)",
  key: "activecampaign-campaign-opened",
  description:
    "Emits an event when a contact opens a campaign (will trigger once per contact per campaign).",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["open"];
    },
  },
};