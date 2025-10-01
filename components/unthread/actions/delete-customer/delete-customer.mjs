import app from "../../unthread.app.mjs";

export default {
  key: "unthread-delete-customer",
  name: "Delete Customer",
  description: "Delete a Customer. [See the documentation](https://docs.unthread.io/api-introduction/using-api#delete-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteCustomer({
      $,
      customerId: this.customerId,
    });

    $.export("$summary", `Successfully deleted Customer with ID '${this.customerId}'`);

    return response;
  },
};
