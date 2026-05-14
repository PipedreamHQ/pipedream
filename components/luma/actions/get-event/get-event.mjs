import luma from "../../luma.app.mjs";

export default {
  key: "luma-get-event",
  name: "Get Event",
  description: "Get admin details for a Luma event the connected calendar can manage. Use **List Events** first if you need to find the event ID. [See the documentation](https://docs.luma.com/reference/get_v1-event-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    luma,
    eventId: {
      propDefinition: [
        luma,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.luma.getEvent({
      $,
      eventId: this.eventId,
    });
    const event = response?.event ?? response;
    const name = event?.name
      ? `: ${event.name}`
      : "";

    $.export("$summary", `Retrieved event ${this.eventId}${name}`);
    return response;
  },
};
