import { axios } from "@pipedream/platform";

export default {
  name: "Get Reservation",
  description: "Fetches a reservation by ID from Booking Experts",
  key: "booking_experts-get-reservation",
  version: "0.0.1",
  type: "action",
  props: {
    booking_experts: {
      type: "app",
      app: "booking_experts",
    },
    reservationId: {
      type: "string",
      label: "Reservation ID",
      description: "ID of the reservation to retrieve",
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "GET",
      url: `https://api.bookingexperts.com/v3/reservations/${this.reservationId}`,
      headers: {
        "X-API-KEY": this.booking_experts.$auth.api_key,
        "accept": "application/vnd.api+json",
      },
    });
  },
};
