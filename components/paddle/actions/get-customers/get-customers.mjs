import app from "../../paddle.app.mjs";

export default {
  key: "paddle-get-customers",
  name: "Get Customers",
  description: "Get a list of customers registered in Paddle. [See the documentation](https://developer.paddle.com/api-reference/customers/list-customers)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getCustomers({
      $,
    });
    $.export("$summary", "Successfully retrieved " + response.data.length + " customers");
    return response;
  },
};
