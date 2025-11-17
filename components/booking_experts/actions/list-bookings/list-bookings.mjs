import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-bookings",
  name: "List Bookings",
  description: "Returns a list of bookings for an administration. [See the documentation](https://developers.bookingexperts.com/reference/administration-bookings-index)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    ownerId: {
      propDefinition: [
        bookingExperts,
        "ownerId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
      description: "Filter by owner",
    },
    administrationChannelId: {
      propDefinition: [
        bookingExperts,
        "administrationChannelId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
      description: "Filter by channel",
    },
    reservationId: {
      propDefinition: [
        bookingExperts,
        "reservationId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
      description: "Filter by reservation",
      optional: true,
    },
    page: {
      propDefinition: [
        bookingExperts,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.listBookings({
      $,
      administrationId: this.administrationId,
      params: {
        "filter[owner]": this.ownerId,
        "filter[channel]": this.listAdministrationChannels,
        "filter[reservations]": this.reservationId,
        "filter[created_at]": this.createdAt,
        "filter[updated_at]": this.updatedAt,
        "page[number]": this.page,
        "page[size]": this.perPage,
      },
    });
    $.export("$summary", `Found ${data.length} bookings`);
    return data;
  },
};
