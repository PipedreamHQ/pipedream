const eventbrite = require("../../eventbrite.app");

module.exports = {
  key: "eventbrite-get-event-summary",
  name: "Get Event Summary",
  description: "Get event data for a specified event.",
  version: "0.0.1",
  type: "action",
  props: {
    eventbrite,
    eventId: { propDefinition: [eventbrite, "eventId"] },
  },
  async run() {
    return await this.eventbrite.getEvent(this.eventId);
  },
};