import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-delete-guest",
  name: "Delete Guest",
  description: "Delete a guest for a reservation. [See the documentation](https://developers.bookingexperts.com/reference/administration-reservation-guests-delete)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    reservationId: {
      propDefinition: [
        bookingExperts,
        "reservationId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
    info: {
      type: "alert",
      alertType: "warning",
      content: "**The API will only list guests created through the Booking Experts API.**",
    },
    guestId: {
      propDefinition: [
        bookingExperts,
        "guestId",
        ({
          administrationId, reservationId,
        }) => ({
          administrationId,
          reservationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.deleteGuest({
      $,
      administrationId: this.administrationId,
      reservationId: this.reservationId,
      guestId: this.guestId,
    });

    $.export("$summary", `Successfully deleted guest with ID ${this.guestId}`);
    return response;
  },
};
