const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Event (Instant)",
  key: "activecampaign-new-event",
  description:
    "Emits an event for the specified event type from ActiveCampaign.",
  version: "0.0.1",
  props: {
    ...common.props,
    eventType: { propDefinition: [activecampaign, "eventType"] },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return [this.eventType];
    },
    getMeta(body) {
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: body.date_time,
        summary: `${body.type} initiated by ${body.initiated_by}`,
        ts
      };
    },
  },
};