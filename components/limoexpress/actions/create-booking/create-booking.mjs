import limoexpress from "../../limoexpress.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "limoexpress-create-booking",
  name: "Create Limo Booking",
  description: "Creates a new limo booking with specified details. [See the documentation](https://api.limoexpress.me/api/docs/v1)",
  version: "0.0.1",
  type: "action",
  props: {
    limoexpress,
    bookingTypeId: {
      propDefinition: [
        limoexpress,
        "bookingTypeId",
      ],
    },
    bookingStatusId: {
      propDefinition: [
        limoexpress,
        "bookingStatusId",
      ],
      optional: true,
    },
    fromLocation: {
      propDefinition: [
        limoexpress,
        "fromLocation",
      ],
    },
    pickupTime: {
      propDefinition: [
        limoexpress,
        "pickupTime",
      ],
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the customer for the booking.",
    },
    toLocation: {
      type: "string",
      label: "To Location",
      description: "The dropoff location.",
      optional: true,
    },
    vehicleId: {
      type: "string",
      label: "Vehicle ID",
      description: "ID of the vehicle to be used for the booking.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.limoexpress.createBooking({
      bookingTypeId: this.bookingTypeId,
      fromLocation: this.fromLocation,
      pickupTime: this.pickupTime,
      additionalFields: {
        booking_status_id: this.bookingStatusId,
        customer_id: this.customerId,
        to_location: this.toLocation,
        vehicle_id: this.vehicleId,
      },
    });

    $.export("$summary", `Successfully created booking with ID ${response.id}`);
    return response;
  },
};
