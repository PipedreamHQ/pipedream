const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Contact Note (Instant)",
  key: "activecampaign-new-contact-note",
  description: "Emits an event each time a new note is added to a contact.",
  version: "0.0.1",
  props: {
    ...common.props,
    contacts: { propDefinition: [activecampaign, "contacts"] },
  },
  methods: {
    getEvents() {
      return ["subscriber_note"];
    },
    isRelevant(body) {
      return (
        this.contacts.length === 0 ||
        this.contacts.includes(body["contact[id]"])
      );
    },
    getMeta(body) {
      return {
        id: `${body["contact[id]"]}${new Date(body.date_time).getTime()}`,
        summary: body.note,
      };
    },
  },
};