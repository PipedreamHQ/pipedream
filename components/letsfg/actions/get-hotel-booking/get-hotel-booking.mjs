import app from "../../letsfg.app.mjs";

export default {
  key: "letsfg-get-hotel-booking",
  name: "Get Hotel Booking",
  description: "Retrieve a hotel booking by its job id. Returns the confirmation, the reservation fee charged, the pay link for the balance, and the cancellation terms once the booking settles. [See the documentation](https://letsfg.co/developers/docs/hotels/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    bookingJobId: {
      propDefinition: [
        app,
        "bookingJobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getHotelBooking({
      $,
      bookingJobId: this.bookingJobId,
    });

    const status = response?.status ?? "unknown";
    $.export("$summary", response?.confirmation
      ? `Booking ${response.confirmation} is ${status}`
      : `Booking job ${this.bookingJobId} is ${status}`);

    return response;
  },
};
