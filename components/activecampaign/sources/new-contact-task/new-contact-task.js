const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Contact Task",
  key: "activecampaign-new-contact-task",
  description: "Emits an event each time a new contact task is created.",
  version: "0.0.1",
  props: {
    ...common.props,
    contacts: { propDefinition: [activecampaign, "contacts"] },
  },
  methods: {
    getEvents() {
      return ["contact_task_add"];
    },
    isRelevant(body) {
      return (
        this.contacts.length === 0 ||
        this.contacts.includes(body["contact[id]"])
      );
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body["task[id]"],
        summary: `${body["task[title]"]}`,
        ts
      };
    },
  },
};