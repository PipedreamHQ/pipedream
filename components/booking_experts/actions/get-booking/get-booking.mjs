import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-get-booking",
  name: "Get Booking",
  description: "Returns a booking. [See the documentation](https://developers.bookingexperts.com/reference/administration-bookings-show)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
    bookingId: {
      propDefinition: [
        bookingExperts,
        "bookingId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.getBooking({
      $,
      administrationId: this.administrationId,
      bookingId: this.bookingId,
    });
    $.export("$summary", `Successfully retrieved booking with ID ${this.bookingId}`);
    return data;
  },
};
