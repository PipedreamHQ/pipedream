import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-cancel-appointment",
  name: "Cancel Appointment",
  description: "Cancels an appointment in a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingappointment-cancel?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    appointmentId: {
      propDefinition: [
        app,
        "appointmentId",
        ({ businessId }) => ({
          businessId,
        }),
      ],
    },
    cancellationMessage: {
      type: "string",
      label: "Cancellation Message",
      description: "A message to send to the customer and staff members about the cancellation",
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      appointmentId,
      cancellationMessage,
    } = this;

    try {
      await app.cancelAppointment({
        businessId,
        appointmentId,
        content: {
          cancellationMessage,
        },
      });

      $.export("$summary", "Successfully cancelled appointment");

      return {
        success: true,
      };
    } catch (error) {
      throw new Error("Failed to cancel appointment, you must provide a cancellation message");
    }

  },
};
