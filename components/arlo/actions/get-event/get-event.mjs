// x-pd-ai: optimized
import arlo from "../../arlo.app.mjs";

export default {
  key: "arlo-get-event",
  name: "Get Event",
  description: "Retrieve the full detail for a single Arlo Event by its ID. Run **List Events** first to find a valid `eventId`. Example: call with `eventId: \"4\"` to get that event's full `Name`, `Code`, `StartDateTime`, `FinishDateTime`, `Status`, and venue/presenter links. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/events#collection-httpget).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    eventId: {
      propDefinition: [
        arlo,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const rawEvent = await this.arlo.getEvent({
      $,
      eventId: this.eventId,
    });
    const event = this.arlo._unwrapItem(rawEvent, "Event");
    $.export("$summary", `Retrieved event ${this.eventId}${event?.Name
      ? `: ${event.Name}`
      : ""}`);
    return event;
  },
};
