const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Contact Added to List",
  key: "activecampaign-contact-added-to-list",
  description: "Emits an event each time a new contact is added to a list.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["subscribe"];
    },
    async getMeta(body) {
      const { list } = await this.activecampaign.getList(body.list);
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["contact[id]"]}${list.id}`,
        summary: `${body["contact[email]"]} added to ${list.name}`,
        ts
      };
    },
  },
};