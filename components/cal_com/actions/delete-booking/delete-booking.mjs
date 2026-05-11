import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-delete-booking",
  name: "Cancel Booking",
  description: "Cancel an existing booking by its UID. Note: Cal.com v2 replaces the v1 delete endpoint with a cancellation flow; the booking is marked cancelled rather than removed. [See the documentation](https://cal.com/docs/api-reference/v2/bookings/cancel-a-booking)",
  version: "0.1.0",
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
    const response = await this.calCom.cancelBooking(this.bookingId, {
      cancellationReason: this.cancellationReason,
      cancelSubsequentBookings: this.cancelSubsequentBookings,
    }, $);
    $.export("$summary", `Successfully cancelled booking with UID ${this.bookingId}`);
    return response;
  },
};
