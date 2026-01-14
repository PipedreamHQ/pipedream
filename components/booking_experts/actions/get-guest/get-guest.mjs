import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-get-guest",
  name: "Get Guest",
  description: "Get a guest by ID. [See the documentation](https://developers.bookingexperts.com/reference/administration-reservation-guests-show)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    reservationId: {
      propDefinition: [
        bookingExperts,
        "reservationId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
    info: {
      type: "alert",
      alertType: "warning",
      content: "**The API will only list guests created through the Booking Experts API.**",
    },
    guestId: {
      propDefinition: [
        bookingExperts,
        "guestId",
        ({
          administrationId, reservationId,
        }) => ({
          administrationId,
          reservationId,
        }),
      ],
    },
    fields: {
      propDefinition: [
        bookingExperts,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.getGuest({
      $,
      administrationId: this.administrationId,
      reservationId: this.reservationId,
      guestId: this.guestId,
      params: {
        "fields[guest]": this.fields,
      },
    });
    $.export("$summary", `Successfully retrieved guest with ID ${this.guestId}`);
    return response;
  },
};
