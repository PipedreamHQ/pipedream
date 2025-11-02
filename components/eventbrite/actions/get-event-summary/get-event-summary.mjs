import eventbrite from "../../eventbrite.app.mjs";

export default {
  key: "eventbrite-get-event-summary",
  name: "Get Event Summary",
  description: "Get event summary for a specified event. [See the documentation](https://www.eventbrite.com/platform/api#/reference/event/retrieve/retrieve-an-event)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
  async run({ $ }) {
    const { summary } = await this.eventbrite.getEvent($, this.eventId);
    $.export("$summary", "Successfully fetched summary");
    return summary;
  },
};
