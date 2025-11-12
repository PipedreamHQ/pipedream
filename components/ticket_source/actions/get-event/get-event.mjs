import ticketSource from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-get-event",
  name: "Get Event",
  description: "Retrieves details of a specific event. [See the documentation](https://reference.ticketsource.io/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ticketSource,
    eventId: {
      propDefinition: [
        ticketSource,
        "eventId",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.ticketSource.getEvent({
      $,
      eventId: this.eventId,
    });
    $.export("$summary", `Successfully retrieved event with ID ${this.eventId}`);
    return response;
  },
};
