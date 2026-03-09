import bookingExperts from "../../booking_experts.app.mjs";

export default {
  name: "Get Reservation",
  description: "Fetches a reservation by ID from Booking Experts. [See the documentation](https://developers.bookingexperts.com/reference/reservations-show)",
  key: "booking_experts-get-reservation",
  version: "0.0.6",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bookingExperts,
    reservationId: {
      propDefinition: [
        bookingExperts,
        "reservationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.getReservation({
      $,
      reservationId: this.reservationId,
    });
    $.export("$summary", `Successfully retrieved reservation with ID ${this.reservationId}`);
    return response;
  },
};
