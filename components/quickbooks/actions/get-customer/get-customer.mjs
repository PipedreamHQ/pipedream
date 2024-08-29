import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-customer",
  name: "Get Customer",
  description: "Returns info about a customer. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/customer#read-a-customer)",
  version: "0.3.4",
  type: "action",
  props: {
    quickbooks,
    customerId: {
      label: "Customer ID",
      type: "string",
      description: "Id of the account to get details of.",
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
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
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved customer with id ${response.Customer.Id}`);
    }

    return response;
  },
};
