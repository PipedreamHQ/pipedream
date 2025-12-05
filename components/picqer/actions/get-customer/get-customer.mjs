import picqer from "../../picqer.app.mjs";

export default {
  key: "picqer-get-customer",
  name: "Get Customer",
  description: "Get a customer in Picqer. [See the documentation](https://picqer.com/en/api/customers#get-single-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picqer,
    customerId: {
      propDefinition: [
        picqer,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picqer.getCustomer({
      $,
      customerId: this.customerId,
    });

    $.export("$summary", `Successfully retrieved customer ${this.customerId}`);
    return response;
  },
};
