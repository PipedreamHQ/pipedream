import demio from "../../demio.app.mjs";

export default {
  key: "demio-get-event",
  name: "Get Event",
  description: "Get a specific event. [See docs here](https://publicdemioapi.docs.apiary.io/#reference/events/event-info/event-info)",
  type: "action",
  version: "0.0.1",
  props: {
    demio,
    eventId: {
      propDefinition: [
        demio,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.demio.getEvent({
      $,
      eventId: this.eventId,
    });

    $.export("$summary", "Successfully retrieved event");

    return response;
  },
};
