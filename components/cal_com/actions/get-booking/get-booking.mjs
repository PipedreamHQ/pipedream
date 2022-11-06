import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-get-booking",
  name: "Get Booking",
  description: "Retrieve a booking by its ID. [See the docs here](https://developer.cal.com/api/api-reference/bookings#find-a-booking)",
  version: "0.0.1",
  type: "action",
  props: {
    calCom,
    booking: {
      propDefinition: [
        calCom,
        "booking",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.calCom.getBooking(this.booking, $);
    $.export("$summary", `Successfully retrieved booking with ID ${this.booking}`);
    return response;
  },
};
