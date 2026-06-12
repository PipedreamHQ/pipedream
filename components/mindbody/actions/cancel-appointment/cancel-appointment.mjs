import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-cancel-appointment",
  name: "Cancel Appointment",
  description:
    "Cancels an existing appointment by setting its status to Cancelled."
    + " Requires the appointment ID — use **Get Appointments** to find the ID by client, date, or staff."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/appointment/update-appointment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    appointmentId: {
      type: "integer",
      label: "Appointment ID",
      description: "The ID of the appointment to cancel. Use **Get Appointments** to find the appointment ID.",
    },
    sendEmail: {
      type: "boolean",
      label: "Send Cancellation Email",
      description: "Whether to send a cancellation confirmation email to the client. Defaults to `false`.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateAppointment({
      $,
      data: {
        AppointmentId: this.appointmentId,
        Status: "Cancelled",
        SendEmail: this.sendEmail ?? false,
      },
    });
    const appt = response.Appointment || {};
    $.export("$summary", `Cancelled appointment ${this.appointmentId} (status: ${appt.Status || "Cancelled"})`);
    return response;
  },
};
