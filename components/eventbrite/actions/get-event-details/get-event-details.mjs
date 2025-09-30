import eventbrite from "../../eventbrite.app.mjs";

export default {
  key: "eventbrite-get-event-details",
  name: "Get Event Details",
  description: "Get details for a specified event. [See the documentation](https://www.eventbrite.com/platform/api#/reference/event/retrieve/retrieve-an-event)",
  version: "0.0.3",
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
    const event = await this.eventbrite.getEvent($, this.eventId);
    $.export("$summary", "Successfully fetched event details");
    return event;
  },
};
