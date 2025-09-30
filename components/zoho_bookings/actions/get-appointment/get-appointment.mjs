import app from "../../zoho_bookings.app.mjs";

export default {
  key: "zoho_bookings-get-appointment",
  name: "Get Appointment Details",
  description: "Get details of an appointment [See the documentation](https://www.zoho.com/bookings/help/api/v1/get-appointment.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    bookingId: {
      type: "string",
      label: "Booking Id",
      description: "The unique id of the previously booked appointment.",
    },
  },
  async run({ $ }) {
    const { response } = await this.app.getAppointment({
      $,
      params: {
        booking_id: this.bookingId,
      },
    });

    if (response?.returnvalue?.status === "failure") {
      throw new Error(response?.returnvalue?.message);
    }
    $.export("$summary", `Successfully fetched the appointment with ID: ${response.returnvalue.booking_id}`);
    return response;
  },
};
