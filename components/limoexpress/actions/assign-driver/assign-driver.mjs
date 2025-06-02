import limoexpress from "../../limoexpress.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "limoexpress-assign-driver",
  name: "Assign Driver",
  description: "Assign a driver to a specific ride. [See the documentation](https://api.limoexpress.me/api/docs/v1)",
  version: "0.0.1",
  type: "action",
  props: {
    limoexpress,
    bookingId: {
      propDefinition: [
        limoexpress,
        "bookingId",
      ],
    },
    driverId: {
      propDefinition: [
        limoexpress,
        "driverId",
      ],
    },
    assignmentNotes: {
      propDefinition: [
        limoexpress,
        "assignmentNotes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.limoexpress.assignDriver({
      bookingId: this.bookingId,
      driverId: this.driverId,
      assignmentNotes: this.assignmentNotes,
    });
    $.export("$summary", `Successfully assigned driver ID ${this.driverId} to booking ID ${this.bookingId}`);
    return response;
  },
};
