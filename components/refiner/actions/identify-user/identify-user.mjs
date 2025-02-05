import { ConfigurationError } from "@pipedream/platform";
import refiner from "../../refiner.app.mjs";

export default {
  key: "refiner-identify-user",
  name: "Identify User",
  description: "Creates or updates a user profile in Refiner. [See the documentation](https://refiner.io/docs/api/#identify-user)",
  version: "0.0.1",
  type: "action",
  props: {
    refiner,
    userId: {
      propDefinition: [
        refiner,
        "userId",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        refiner,
        "email",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.userId && !this.email) {
      throw new ConfigurationError("Either User Id or E mail must be provided to identify the user.");
    }

    const response = await this.refiner.identifyUser({
      $,
      data: {
        id: this.userId,
        email: this.email,
      },
    });

    $.export("$summary", `User identified successfully. Contact UUID: ${response.contact_uuid}`);
    return response;
  },
};
