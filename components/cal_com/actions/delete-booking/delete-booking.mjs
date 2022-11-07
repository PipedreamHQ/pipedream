import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-delete-booking",
  name: "Delete Booking",
  description: "Delete an existing booking by its ID. [See the docs here](https://developer.cal.com/api/api-reference/bookings)",
  version: "0.0.1",
  type: "action",
  props: {
    calCom,
    booking: {
      propDefinition: [
        calCom,
        "booking",
        () => ({
          filterCancelled: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.calCom.deleteBooking(this.booking, $);
    $.export("$summary", `Successfully deleted booking with ID ${this.booking}`);
    return response;
  },
};
