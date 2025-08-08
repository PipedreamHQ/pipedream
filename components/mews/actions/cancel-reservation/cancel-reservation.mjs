import app from "../../mews.app.mjs";

export default {
  name: "Cancel Reservation",
  description: "Cancel a reservation in Mews.",
  key: "mews-cancel-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reservationIds: {
      type: "string[]",
      label: "Reservation IDs",
      description: "IDs of reservations to cancel",
    },
  },
  async run({ $ }) {
    const {
      app: mews, reservationIds,
    } = this;
    const data = {
      ReservationIds: reservationIds,
    };
    const response = await mews.reservationsCancel({
      data,
      $,
    });
    $.export("summary", `Cancelled ${reservationIds.length} reservation(s)`);
    return response;
  },
};

