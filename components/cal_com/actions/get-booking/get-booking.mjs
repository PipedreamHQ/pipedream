import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-booking",
  name: "Get Booking",
  description: "Retrieve a booking by its UID. [See the documentation](https://cal.com/docs/api-reference/v2/bookings/get-a-booking)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calCom,
    bookingId: {
      propDefinition: [
        calCom,
        "bookingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.calCom.getBooking(this.bookingId, $);
    $.export("$summary", `Successfully retrieved booking with UID ${this.bookingId}`);
    return response;
  },
};
