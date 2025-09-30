import hostaway from "../../hostaway.app.mjs";

export default {
  key: "hostaway-create-reservation",
  name: "Create Reservation",
  description: "Creates a new reservation in Hostaway. [See the documentation](https://api.hostaway.com/documentation#create-a-reservation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hostaway,
    channelId: {
      propDefinition: [
        hostaway,
        "channelId",
      ],
    },
    listingMapId: {
      propDefinition: [
        hostaway,
        "listingId",
      ],
    },
    arrivalDate: {
      type: "string",
      label: "Arrival Date",
      description: "Arrival date in `YYYY-MM-DD` format, e.g. `2024-08-15`",
    },
    departureDate: {
      type: "string",
      label: "Departure Date",
      description: "Departure date in `YYYY-MM-DD` format, e.g. `2024-08-19`",
    },
    guestName: {
      type: "string",
      label: "Guest Name",
      description: "Name of the guest",
      optional: true,
    },
    guestEmail: {
      type: "string",
      label: "Guest Email",
      description: "Email address of the guest",
      optional: true,
    },
    numberOfGuests: {
      type: "integer",
      label: "Number of Guests",
      description: "Number of guests for the reservation",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to set for the reservation. [See the documentation](https://api.hostaway.com/documentation#reservation-object) for all available fields.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      hostaway, additionalFields = {}, ...data
    } = this;
    const { result } = await hostaway.createReservation({
      $,
      data: {
        ...data,
        ...additionalFields,
      },
    });

    if (result?.id) {
      $.export("summary", `Successfully created reservation (ID: ${result.id})`);
    }

    return result;
  },
};
