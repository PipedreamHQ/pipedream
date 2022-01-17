import shopify from "../../shopify.app.js";

export default {
  key: "shopify-update-customer",
  name: "Update Customer",
  description: "Update a existing customer",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    customerId: {
      type: "string",
      label: "Customer ID",
      description: `The Customer ID
        Option displayed here as email registered with the Customer ID`,
      propDefinition: [
        shopify,
        "customerIds",
        (c) => c,
      ],
    },
    customer: {
      type: "object",
      label: "Customer",
      description: "Update details for a customer",
    },
  },
  async run({ $ }) {
    if (typeof this.customer == "string") {
      this.customer = JSON.parse(this.customer);
    }
    let response = await this.shopify.updateCustomer(this.customerId, this.customer);
    $.export("$summary", `Updated customer \`${response.email}\` with id \`${response.id}\``);
    return response;
  },
};
