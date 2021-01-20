const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Deal Added or Updated (Instant)",
  key: "activecampaign-new-or-updated-deal",
  description: "Emits an event each time a deal is added or updated.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["deal_add", "deal_update"];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["deal[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body["deal[title]"],
        ts
      };
    },
  },
};