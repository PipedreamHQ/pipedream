import helpcrunch from "../../helpcrunch.app.mjs";

export default {
  key: "helpcrunch-create-customer",
  name: "Create Customer",
  description: "Creates a new customer record within the Helpcrunch platform. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpcrunch,
    customerAttributes: {
      type: "object",
      label: "Customer Attributes",
      description: "Attributes to create the customer",
    },
  },
  async run({ $ }) {
    const response = await this.helpcrunch.createCustomer(this.customerAttributes);
    $.export("$summary", "Successfully created customer");
    return response;
  },
};
