import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-delete-booking",
  name: "Delete Booking",
  description: "Delete an existing booking by its UID. [See the documentation](https://cal.com/docs/api-reference/v2/bookings/cancel-a-booking)",
  version: "0.0.7",
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
      description: "The UID of the booking to cancel",
    },
    cancellationReason: {
      type: "string",
      label: "Cancellation Reason",
      description: "The reason for cancelling the booking",
      optional: true,
    },
    cancelSubsequentBookings: {
      type: "boolean",
      label: "Cancel Subsequent Bookings",
      description: "Whether to cancel all subsequent occurrences of a recurring booking",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.cancellationReason) data.cancellationReason = this.cancellationReason;
    if (this.cancelSubsequentBookings !== undefined) {
      data.cancelSubsequentBookings = this.cancelSubsequentBookings;
    }
    const response = await this.calCom.deleteBooking(this.bookingId, data, $);
    $.export("$summary", `Successfully cancelled booking with UID ${this.bookingId}`);
    return response;
  },
};
