import pennylane from "../../pennylane.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pennylane-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Pennylane. [See the documentation](https://pennylane.readme.io/reference/customers-post-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pennylane,
    customerName: {
      propDefinition: [
        pennylane,
        "customerName",
      ],
    },
    customerEmail: {
      propDefinition: [
        pennylane,
        "customerEmail",
      ],
    },
    customerContactInfo: {
      propDefinition: [
        pennylane,
        "customerContactInfo",
      ],
    },
    customerAddress: {
      propDefinition: [
        pennylane,
        "customerAddress",
      ],
    },
    customerMetadata: {
      propDefinition: [
        pennylane,
        "customerMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pennylane.createCustomer();
    $.export("$summary", `Created customer ${response.customer.name}`);
    return response;
  },
};
