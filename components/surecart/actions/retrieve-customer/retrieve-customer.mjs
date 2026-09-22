import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-customer",
  name: "Retrieve Customer",
  description: "Retrieve a customer by ID. [See the documentation](https://developer.surecart.com/api-reference/customers/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    customerId: {
      propDefinition: [
        surecart,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getCustomer({
      $,
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully retrieved customer ${this.customerId}`);
    return response;
  },
};
