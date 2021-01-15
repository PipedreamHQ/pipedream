const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-campaign.js");

module.exports = {
  ...common,
  name: "New Campaign Bounce (Instant)",
  key: "activecampaign-campaign-bounce",
  description:
    "Emits an event when a contact email address bounces from a sent campaign.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["bounce"];
    },
  },
};