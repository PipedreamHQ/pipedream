import woocommerce from "../../woocommerce.app.mjs";

export default {
  key: "woocommerce-get-customer",
  name: "Get Customer",
  description: "Retrieve a specific customer. [See the docs](https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#retrieve-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    woocommerce,
    customer: {
      propDefinition: [
        woocommerce,
        "customer",
      ],
      description: "ID of the Customer",
      withLabel: true,
    },
  },
  async run({ $ }) {
    const response = await this.woocommerce.getCustomer(this.customer.value);

    $.export("$summary", `Successfully retrieved customer ${this.customer.label} (ID: ${response.id})`);

    return response;
  },
};
