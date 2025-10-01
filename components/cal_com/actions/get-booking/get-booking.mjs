import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-booking",
  name: "Get Booking",
  description: "Retrieve a booking by its ID. [See the documentation](https://developer.cal.com/api/api-reference/bookings#find-a-booking)",
  version: "0.0.5",
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
    $.export("$summary", `Successfully retrieved booking with ID ${this.bookingId}`);
    return response;
  },
};
