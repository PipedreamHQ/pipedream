import app from "../../mews.app.mjs";

export default {
  name: "Create Reservation",
  description: "Create a reservation in Mews.",
  key: "mews-create-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reservations: {
      type: "string[]",
      label: "Reservations (JSON)",
      description: "Array of reservation objects as JSON strings, each per Mews API schema.",
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
    const response = await mews.reservationsCreate({
      data,
      $,
    });
    $.export("summary", `Created ${reservations.length} reservation(s)`);
    return response;
  },
};

