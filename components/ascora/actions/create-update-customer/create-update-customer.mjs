import ascora from "../../ascora.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ascora-create-update-customer",
  name: "Create or Update Customer",
  description: "Creates a new customer record or modifies an existing one in Ascora. [See the documentation](https://support.ascora.com.au/display/as/api+endpoints)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ascora,
    customerDetails: {
      propDefinition: [
        ascora,
        "customerDetails",
      ],
    },
    customerId: {
      propDefinition: [
        ascora,
        "customerId",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ascora.createOrModifyCustomer({
      customerDetails: this.customerDetails,
      customerId: this.customerId,
    });

    const summary = this.customerId
      ? `Updated customer with ID: ${this.customerId}`
      : "Created new customer";
    $.export("$summary", summary);

    return response;
  },
};
