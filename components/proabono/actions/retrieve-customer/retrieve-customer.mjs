import proabono from "../../proabono.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proabono-retrieve-customer",
  name: "Retrieve Customer",
  description: "Fetches an existing customer from the proabono system using their unique identifier",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    proabono,
    customerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proabono.getCustomer({
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully fetched customer with ID: ${this.customerId}`);
    return response;
  },
};
