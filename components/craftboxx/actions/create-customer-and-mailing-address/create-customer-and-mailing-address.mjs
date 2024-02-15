import craftboxx from "../../craftboxx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "craftboxx-create-customer-and-mailing-address",
  name: "Create Customer and Mailing Address",
  description: "Creates a new customer along with their mailing address in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    craftboxx,
    customerName: {
      propDefinition: [
        craftboxx,
        "customerName",
      ],
    },
    customerEmail: {
      propDefinition: [
        craftboxx,
        "customerEmail",
      ],
    },
    customerAddress: {
      propDefinition: [
        craftboxx,
        "customerAddress",
      ],
    },
    customerSecondaryAddress: {
      propDefinition: [
        craftboxx,
        "customerSecondaryAddress",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const customerData = {
      name: this.customerName,
      email: this.customerEmail,
      address: this.customerAddress,
      secondaryAddress: this.customerSecondaryAddress || undefined,
    };

    const response = await this.craftboxx.createCustomer(customerData);
    $.export("$summary", `Successfully created customer with name ${this.customerName}`);
    return response;
  },
};
