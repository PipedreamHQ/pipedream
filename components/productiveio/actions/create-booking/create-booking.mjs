import productiveio from "../../productiveio.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "productiveio-create-booking",
  name: "Create Booking",
  description: "Creates a new booking in Productive. [See the documentation](https://developer.productive.io/bookings.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    productiveio,
    bookingDetails: {
      propDefinition: [
        productiveio,
        "bookingDetails",
      ],
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of the person for which the booking is created (required)",
    },
    startedOn: {
      type: "string",
      label: "Started On",
      description: "The start date of the booking (required)",
    },
    endedOn: {
      type: "string",
      label: "Ended On",
      description: "The end date of the booking (required)",
    },
    time: {
      type: "integer",
      label: "Time",
      description: "The time for the booking, in hours (required)",
    },
    bookingMethodId: {
      type: "integer",
      label: "Booking Method ID",
      description: "The booking method ID: 1 for hours per day, 2 for percentage per day, 3 for total time (required)",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event, required if you are making a Timeoff/Event booking",
      optional: true,
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The ID of the service, required if you are making a Service booking",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note for the booking",
      optional: true,
    },
    percentage: {
      type: "integer",
      label: "Percentage",
      description: "Percentage of working hours, must be set to 50 or 100, required with bookingMethodId 2",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.productiveio.createBooking({
      data: {
        type: "bookings",
        attributes: {
          person_id: this.personId,
          started_on: this.startedOn,
          ended_on: this.endedOn,
          time: this.time,
          booking_method_id: this.bookingMethodId,
          event_id: this.eventId,
          service_id: this.serviceId,
          note: this.note,
          percentage: this.percentage,
        },
      },
    });

    $.export("$summary", "Successfully created a new booking");
    return response;
  },
};
