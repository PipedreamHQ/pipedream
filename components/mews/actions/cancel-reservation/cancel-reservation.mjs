import app from "../../mews.app.mjs";

export default {
  name: "Cancel Reservation",
  description: "Cancel a reservation in Mews.",
  key: "mews-cancel-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reservationId: {
      propDefinition: [
        app,
        "reservationId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      reservationId,
    } = this;
    const response = await app.reservationsCancel({
      $,
      data: {
        ReservationIds: [
          reservationId,
        ],
      },
    });
    $.export("summary", "Successfully cancelled reservation");
    return response;
  },
};

