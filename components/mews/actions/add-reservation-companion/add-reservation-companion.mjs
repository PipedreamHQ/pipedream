import app from "../../mews.app.mjs";

export default {
  name: "Add Reservation Companion",
  description: "Add a customer as a companion to a reservation. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#add-reservation-companion)",
  key: "mews-add-reservation-companion",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "Identifier of the reservation to add the companion to.",
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      description: "Identifier of the customer who will be the companion.",
    },
  },
  async run({ $ }) {
    const {
      app,
      reservationId,
      customerId,
    } = this;

    const response = await app.reservationsAddCompanion({
      $,
      data: {
        ReservationId: reservationId,
        CustomerId: customerId,
      },
    });

    $.export("$summary", `Successfully added reservation companion with ID \`${response.CompanionshipId}\``);
    return response;
  },
};
