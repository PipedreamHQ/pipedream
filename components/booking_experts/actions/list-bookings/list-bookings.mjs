import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-bookings",
  name: "List Bookings",
  description: "Returns a list of bookings for an administration. [See the documentation](https://developers.bookingexperts.com/reference/administration-bookings-index)",
  version: "0.0.7",
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
    reservationIds: {
      type: "string[]",
      label: "Reservation IDs",
      description: "Filter by reservation IDs",
      propDefinition: [
        bookingExperts,
        "reservationId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Filter by created at (ISO 8601 format, e.g., `2024-01-01T00:00:00Z`)",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "Filter by updated at (ISO 8601 format, e.g., `2024-01-01T00:00:00Z`)",
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
    filterId: {
      optional: true,
      propDefinition: [
        bookingExperts,
        "bookingId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filter by customer IDs",
      propDefinition: [
        bookingExperts,
        "customerId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
    bookingNr: {
      label: "Booking Number",
      description: "Filter by booking number",
      optional: true,
      propDefinition: [
        bookingExperts,
        "bookingId",
        ({ administrationId }) => ({
          administrationId,
          mapper: ({ attributes: { booking_nr: value } }) => value,
        }),
      ],
    },
    confirmedAt: {
      type: "string",
      label: "Confirmed At",
      description: "Filter by confirmed at (ISO 8601 format, e.g., `2024-01-01T00:00:00Z`)",
      optional: true,
    },
    fieldsBooking: {
      type: "string[]",
      label: "Fields Booking",
      description: "Fields to return for the booking",
      optional: true,
    },
    referenceNr: {
      type: "string",
      label: "Reference Number",
      description: "Filter by reference number",
      optional: true,
    },
  },
  methods: {
    commaSeparatedList(value) {
      return Array.isArray(value) && value?.length > 0
        ? value.join(",")
        : value;
    },
  },
  async run({ $ }) {
    const {
      commaSeparatedList,
      administrationId,
      ownerId,
      administrationChannelId,
      reservationIds,
      createdAt,
      updatedAt,
      page,
      perPage,
      filterId,
      customerIds,
      bookingNr,
      confirmedAt,
      fieldsBooking,
      referenceNr,
    } = this;

    const { data } = await this.bookingExperts.listBookings({
      $,
      administrationId,
      params: {
        "filter[owner]": ownerId,
        "filter[channel]": administrationChannelId,
        "filter[created_at]": createdAt,
        "filter[updated_at]": updatedAt,
        "page[number]": page,
        "page[size]": perPage,
        "filter[ID]": filterId,
        "filter[reservations]": commaSeparatedList(reservationIds),
        "filter[customer]": commaSeparatedList(customerIds),
        "filter[booking_nr]": bookingNr,
        "filter[confirmed_at]": confirmedAt,
        "fields[booking]": commaSeparatedList(fieldsBooking),
        "filter[reference_nr]": referenceNr,
      },
    });
    $.export("$summary", `Found ${data.length} bookings`);
    return data;
  },
};
