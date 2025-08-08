import app from "../../mews.app.mjs";

export default {
  name: "Update Reservation",
  description: "Update an existing reservation in Mews.",
  key: "mews-update-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reservations: {
      type: "string[]",
      label: "Reservations (JSON)",
      description: "Array of reservation objects with Id and fields to update, as JSON strings.",
    },
  },
  async run({ $ }) {
    const { app: mews } = this;
    const reservations = (this.reservations || []).map((r) => {
      try { return JSON.parse(r); } catch { return r; }
    });
    const data = {
      Reservations: reservations,
    };
    const response = await mews.reservationsUpdate({
      data,
      $,
    });
    $.export("summary", `Updated ${reservations.length} reservation(s)`);
    return response;
  },
};

