import app from "../../paddle.app.mjs";

export default {
  key: "paddle-create-customer",
  name: "Create Customer",
  description: "Create a new customer in Paddle. [See the documentation](https://developer.paddle.com/api-reference/customers/create-customer)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
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
  },
  async run({ $ }) {
    const response = await this.app.createCustomer({
      $,
      data: {
        email: this.email,
        name: this.name,
        custom_data: this.customData,
      },
    });
    $.export("$summary", "Successfully created a new customer with the ID: " + response.data.id);
    return response;
  },
};
