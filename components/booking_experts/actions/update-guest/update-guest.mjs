import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-update-guest",
  name: "Update Guest",
  description:
    "Update a guest for a reservation. [See the documentation](https://developers.bookingexperts.com/reference/administration-reservation-guests-update)",
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
      content:
        "**The API will only list guests created through the Booking Experts API.**",
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
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the guest",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the guest",
      optional: true,
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
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the guest",
      optional: true,
      options: [
        "male",
        "female",
        "other",
      ],
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the guest in YYYY-MM-DD format",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.bookingExperts.updateGuest({
      $,
      administrationId: this.administrationId,
      reservationId: this.reservationId,
      guestId: this.guestId,
      data: {
        data: {
          id: this.guestId,
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
            gender: this.gender,
            date_of_birth: this.dateOfBirth,
          },
        },
      },
    });
    $.export("$summary", "Guest updated");
    return data;
  },
};
