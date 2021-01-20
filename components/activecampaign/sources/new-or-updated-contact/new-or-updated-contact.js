const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New or Updated Contact (Instant)",
  key: "activecampaign-new-or-updated-contact",
  description: "Emits an event each time a contact is added or updated.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["subscribe", "update"];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["contact[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body["contact[email]"],
        ts
      };
    },
  },
};