const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Updated Contact (Instant)",
  key: "activecampaign-updated-contact",
  description: "Emits an event each time a contact is updated.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEvents() {
      return ["update"];
    },
    getMeta(body) {
      return {
        id: `${body["contact[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body["contact[email]"],
      };
    },
  },
};