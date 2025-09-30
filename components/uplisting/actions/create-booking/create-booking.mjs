import uplisting from "../../uplisting.app.mjs";

export default {
  key: "uplisting-create-booking",
  name: "Create Booking",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a confirmed booking. [See the documentation](https://documenter.getpostman.com/view/1320372/SWTBfdW6#ce173dfb-5d88-4af4-a55f-43ffc238487a)",
  type: "action",
  props: {
    uplisting,
    clientId: {
      type: "string",
      label: "X-Uplisting-Client-ID",
      description: "Contact Uplisting if you don't have a partner specific client ID.",
      secret: true,
    },
    checkIn: {
      type: "string",
      label: "Check In",
      description: "The date of the check in.",
    },
    checkOut: {
      type: "string",
      label: "Check Out",
      description: "The date of the check out.",
    },
    propertyId: {
      propDefinition: [
        uplisting,
        "propertyId",
      ],
    },
    guestName: {
      type: "string",
      label: "Guest Name",
      description: "Guest name shown on the booking calendar and used for automated messaging.",
      optional: true,
    },
    guestEmail: {
      type: "string",
      label: "Guest Email",
      description: "A valid email is required for any scheduled messages to be delivered to the guest.",
      optional: true,
    },
    guestPhone: {
      type: "string",
      label: "Guest Phone",
      description: "The guest's phone number.",
      optional: true,
    },
    numberOfGuests: {
      type: "integer",
      label: "Number Of Guests",
      description: "Used for price calculation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.uplisting.createBooking({
      $,
      headers: {
        "X-Uplisting-Client-ID": this.clientId,
      },
      data: {
        data: {
          "attributes": {
            check_in: this.checkIn,
            check_out: this.checkOut,
            guest_name: this.guestName,
            guest_email: this.guestEmail,
            guest_phone: this.guestPhone,
            number_of_guests: this.numberOfGuests,
          },
          "relationships": {
            property: {
              data: {
                type: "properties",
                id: this.propertyId,
              },
            },
          },
        },
      },
    });

    $.export("$summary", `A new booking with Id: ${response.data?.id} was successfully created!`);
    return response;
  },
};
