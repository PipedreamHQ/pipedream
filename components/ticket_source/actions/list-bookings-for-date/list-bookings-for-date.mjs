import ticketSource from "../../ticket_source.app.mjs";

export default {
  key: "ticket_source-list-bookings-for-date",
  name: "List Bookings for Date",
  description: "Retrieves all bookings for a specific event date. [See the documentation](https://reference.ticketsource.io/#/operations/get-date-bookings)",
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
  },
  async run({ $ }) {
    const response = this.ticketSource.paginate({
      $,
      fn: this.ticketSource.listBookingsForDate,
      eventDate: this.eventDate,
    });

    let responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully retrieved ${responseArray.length} booking(s) for date with ID ${this.eventDate}`);
    return responseArray;
  },
};

