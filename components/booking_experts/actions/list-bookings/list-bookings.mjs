import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-bookings",
  name: "List Bookings",
  description: "Returns a list of bookings for an administration. [See the documentation](https://developers.bookingexperts.com/reference/administration-bookings-index)",
  version: "0.0.1",
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
    channelId: {
      propDefinition: [
        bookingExperts,
        "channelId",
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
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Filter by created at date. Example: `2025-08-28`",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "Filter by updated at date. Example: `2025-08-28`",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of items per page",
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.listBookings({
      $,
      administrationId: this.administrationId,
      params: {
        "filter[owner]": this.ownerId,
        "filter[channel]": this.channelId,
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
