const eventbrite = require("../../eventbrite.app");

module.exports = {
  key: "eventbrite-get-event-summary",
  name: "Get Event Summary",
  description: "Get event summary for a specified event.",
  version: "0.0.1",
  type: "action",
  props: {
    eventbrite,
    eventId: {
      propDefinition: [
        eventbrite,
        "eventId",
      ],
    },
  },
  async run() {
    const { summary } = await this.eventbrite.getEvent(this.eventId);
    return summary;
  },
};
