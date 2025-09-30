import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-customer",
  name: "Get Customer",
  description: "Returns info about a customer. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/customer#read-a-customer)",
  version: "0.3.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    customerId: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
  },
  async run({ $ }) {
    if (!this.customerId) {
      throw new ConfigurationError("Must provide customerId parameter.");
    }

    const response = await this.quickbooks.getCustomer({
      $,
      customerId: this.customerId,
    });

    if (response) {
      $.export("summary", `Successfully retrieved customer with ID ${response.Customer.Id}`);
    }

    return response;
  },
};
