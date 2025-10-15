import app from "../../paddle.app.mjs";

export default {
  key: "paddle-update-customer",
  name: "Update Customer",
  description: "Update the customer with the specified ID. [See the documentation](https://developer.paddle.com/api-reference/customers/update-customer)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: true,
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
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    customData: {
      propDefinition: [
        app,
        "customData",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateCustomer({
      $,
      customerId: this.customerId,
      data: {
        email: this.email,
        name: this.name,
        custom_data: this.customData,
        status: this.status,
      },
    });
    $.export("$summary", "Successfully updated the customer with ID: " + this.customerId);
    return response;
  },
};
