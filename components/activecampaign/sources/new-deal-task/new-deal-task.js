const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Deal Task (Instant)",
  key: "activecampaign-new-deal-task",
  description: "Emits an event each time a new task is added to a deal.",
  version: "0.0.1",
  props: {
    ...common.props,
    deals: { propDefinition: [activecampaign, "deals"] },
  },
  methods: {
    getEvents() {
      return ["deal_task_add"];
    },
    isRelevant(body) {
      return this.deals.length === 0 || this.deals.includes(body["deal[id]"]);
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body["task[id]"],
        summary: `${body["task[title]"]} added to ${body["deal[title]"]}`,
        ts
      };
    },
  },
};