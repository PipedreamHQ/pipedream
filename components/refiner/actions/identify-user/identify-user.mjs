import { ConfigurationError } from "@pipedream/platform";
import refiner from "../../refiner.app.mjs";

export default {
  key: "refiner-identify-user",
  name: "Identify User",
  description: "Identify a user with user ID or email. If the user does not exist, a new one will be created. [See the documentation](https://refiner.io/docs/api/#identify-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      throw new ConfigurationError("Either User ID or Email must be provided to identify the user.");
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
