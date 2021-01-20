const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Deal Note (Instant)",
  key: "activecampaign-new-deal-note",
  description: "Emits an event each time a new note is added to a deal.",
  version: "0.0.1",
  props: {
    ...common.props,
    deals: { propDefinition: [activecampaign, "deals"] },
  },
  methods: {
    getEvents() {
      return ["deal_note_add"];
    },
    isRelevant(body) {
      return this.deals.length === 0 || this.deals.includes(body["deal[id]"]);
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body["deal[id]"],
        summary: body["note[text]"],
        ts
      };
    },
  },
};