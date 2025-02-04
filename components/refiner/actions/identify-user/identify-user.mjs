import refiner from "../../refiner.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "refiner-identify-user",
  name: "Identify User",
  description: "Creates or updates a user profile in Refiner. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    refiner,
    userId: {
      propDefinition: [
        refiner,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        refiner,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.refiner.identifyUser({
      userId: this.userId,
      email: this.email,
    });

    $.export("$summary", `User identified successfully. Contact UUID: ${response.contact_uuid}`);
    return response;
  },
};
