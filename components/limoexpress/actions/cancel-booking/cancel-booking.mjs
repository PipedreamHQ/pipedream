import limoexpress from "../../limoexpress.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "limoexpress-cancel-booking",
  name: "Cancel Booking",
  description: "Cancel an existing booking using its ID. [See the documentation](https://api.limoexpress.me/api/docs/v1)",
  version: "0.0.1", // Use this due to the lack of template tag functionality
  type: "action",
  props: {
    limoexpress,
    bookingId: {
      propDefinition: [
        limoexpress,
        "bookingId",
      ],
    },
    cancellationReason: {
      propDefinition: [
        limoexpress,
        "cancellationReason",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.limoexpress.cancelBooking({
      bookingId: this.bookingId,
      cancellationReason: this.cancellationReason,
    });

    $.export("$summary", `Successfully canceled booking with ID: ${this.bookingId}`);
    return response;
  },
};
