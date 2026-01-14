import bookingExperts from "../../booking_experts.app.mjs";

export default {
  name: "List Reservations",
  description: "Lists all reservations for the current organization from Booking Experts. [See the documentation](https://developers.bookingexperts.com/reference/reservations-index)",
  key: "booking_experts-list-reservations",
  version: "0.0.5",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bookingExperts,
    page: {
      type: "integer",
      label: "Page Number",
      description: "Page number for paginating reservations",
      optional: true,
      default: 1,
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.listReservations({
      $,
      params: {
        "page[number]": this.page,
        "page[size]": this.perPage,
      },
    });
    $.export("$summary", `Found ${response.data.length} reservations`);
    return response;
  },
};
