import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-customer",
  name: "Delete Customer",
  description: "Delete a customer by ID. [See the documentation](https://developer.surecart.com/api-reference/customers/delete)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.surecart.deleteCustomer({
      $,
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully deleted customer ${this.customerId}`);
    return response;
  },
};
