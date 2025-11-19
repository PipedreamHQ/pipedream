import ticketSource from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-get-booking",
  name: "Get Booking",
  description: "Retrieves details of a specific booking. [See the documentation](https://reference.ticketsource.io/#/operations/get-booking)",
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
    eventDate: {
      propDefinition: [
        ticketSource,
        "eventDate",
        ({ eventId }) => ({
          eventId,
        }),
      ],
    },
    bookingId: {
      propDefinition: [
        ticketSource,
        "bookingId",
        ({ eventDate }) => ({
          eventDate,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.ticketSource.getBooking({
      $,
      bookingId: this.bookingId,
    });

    $.export("$summary", `Successfully retrieved booking with ID ${this.bookingId}`);
    return response;
  },
};
