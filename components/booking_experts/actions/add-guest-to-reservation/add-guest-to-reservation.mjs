import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-add-guest-to-reservation",
  name: "Add Guest to Reservation",
  description: "Add a guest to a reservation. [See the documentation](https://developers.bookingexperts.com/reference/administration-reservation-guests-create)",
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
    reservationId: {
      propDefinition: [
        bookingExperts,
        "reservationId",
        (c) => ({
          administrationId: c.administrationId,
        }),
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the guest",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the guest",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the guest",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the guest",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The street address of the guest",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the guest",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the guest",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the guest",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.addGuestToReservation({
      $,
      administrationId: this.administrationId,
      reservationId: this.reservationId,
      data: {
        data: {
          type: "guest",
          attributes: {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            phone: this.phone,
            address: this.address,
            city: this.city,
            postal_code: this.postalCode,
            country_code: this.countryCode,
          },
        },
      },
    });
    $.export("$summary", "Guest added to reservation");
    return data;
  },
};
