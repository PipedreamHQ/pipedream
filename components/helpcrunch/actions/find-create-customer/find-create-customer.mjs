import helpcrunch from "../../helpcrunch.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "helpcrunch-find-create-customer",
  name: "Find or Create Customer",
  description: "Search for an existing customer within Helpcrunch platform, if no match is found it creates a new customer record. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpcrunch,
    customerAttributes: {
      type: "object",
      label: "Customer Attributes",
      description: "Attributes to search or create the customer",
    },
  },
  async run({ $ }) {
    const customer = await this.helpcrunch.searchOrCreateCustomer(this.customerAttributes);
    $.export("$summary", `Found or created customer with ID: ${customer.id}`);
    return customer;
  },
};
