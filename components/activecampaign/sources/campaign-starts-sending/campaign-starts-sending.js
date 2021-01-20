const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Campaign Starts Sending (Instant)",
  key: "activecampaign-campaign-starts-sending",
  description: "Emits an event each time a campaign starts sending.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["sent"];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body["campaign[id]"],
        summary: body["campaign[name]"],
        ts
      };
    },
  },
};