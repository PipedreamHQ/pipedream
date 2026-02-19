import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-delete-booking",
  name: "Delete Booking",
  description: "Delete an existing booking by its ID. [See the documentation](https://developer.cal.com/api/api-reference/bookings)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    calCom,
    bookingId: {
      propDefinition: [
        calCom,
        "bookingId",
        () => ({
          filterCancelled: true,
        }),
      ],
      description: "The identifier of the booking to delete",
    },
  },
  async run({ $ }) {
    const response = await this.calCom.deleteBooking(this.bookingId, $);
    $.export("$summary", `Successfully deleted booking with ID ${this.bookingId}`);
    return response;
  },
};
