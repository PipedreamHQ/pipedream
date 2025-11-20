import { axios } from "@pipedream/platform";

export default {
  name: "List Reservations",
  description: "Lists all reservations for the current organization from Booking Experts",
  key: "booking_experts-list-reservations",
  version: "0.0.1",
  type: "action",
  props: {
    booking_experts: {
      type: "app",
      app: "booking_experts",
    },
    
    page: {
      type: "integer",
      label: "Page Number",
      description: "Page number for paginating reservations",
      optional: true,
      default: 1,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "GET",
      url: `https://api.bookingexperts.com/v3/reservations`,
      headers: {
        "X-API-KEY": this.booking_experts.$auth.api_key,
        "accept": "application/vnd.api+json",
      },
      params: {
        "page[number]": this.page,
      },
    });
  },
};
