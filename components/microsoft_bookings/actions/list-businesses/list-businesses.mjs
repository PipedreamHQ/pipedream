import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-list-businesses",
  name: "List Booking Businesses",
  description: "Lists all Microsoft Bookings businesses. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-list?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.listBusinesses();

    const businesses = response.value || [];

    $.export("$summary", `Successfully retrieved ${businesses.length} business(es)`);

    return response;
  },
};
