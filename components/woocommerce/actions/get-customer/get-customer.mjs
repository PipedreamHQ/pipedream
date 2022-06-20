import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-get-customer",
  name: "Get Customer",
  description: "Retrieve a specific customer. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#retrieve-a-customer)",
  version: "0.0.1",
  type: "action",
  props: {
    woocommerce,
    customer: {
      propDefinition: [
        woocommerce,
        "customer",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.woocommerce.getCustomer(this.customer);

    $.export("$summary", `Successfully retrieved customer ID: ${response.id}`);

    return response;
  },
};
