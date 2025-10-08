import app from "../../mews.app.mjs";

export default {
  name: "Cancel Reservation",
  description: "Cancel a reservation in Mews.",
  key: "mews-cancel-reservation",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    reservationId: {
      propDefinition: [
        app,
        "reservationId",
      ],
    },
    notes: {
      description: "Reason for cancellation.",
      propDefinition: [
        app,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      reservationId,
      notes,
    } = this;
    const response = await app.reservationsCancel({
      $,
      data: {
        ReservationIds: [
          reservationId,
        ],
        Notes: notes,
      },
    });
    $.export("$summary", "Successfully cancelled reservation");
    return response;
  },
};

