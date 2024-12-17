import rejoiner from "../../rejoiner.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rejoiner-update-customer-profile",
  name: "Update Customer Profile",
  description: "Updates a customer's profile information. [See the documentation](https://docs.rejoiner.com/docs/getting-started)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rejoiner,
    customerId: {
      propDefinition: [
        rejoiner,
        "customerId",
      ],
    },
    profileData: {
      propDefinition: [
        rejoiner,
        "profileData",
      ],
    },
    updateSource: {
      propDefinition: [
        rejoiner,
        "updateSource",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rejoiner.updateCustomerProfile();
    $.export("$summary", `Updated customer profile for customer_id ${this.customerId}`);
    return response;
  },
};
