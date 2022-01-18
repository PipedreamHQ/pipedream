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
      propDefinition: [
        shopify,
        "customerId",
        (c) => c,
      ],
    },
    customer: {
      propDefinition: [
        shopify,
        "customer",
      ],
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
