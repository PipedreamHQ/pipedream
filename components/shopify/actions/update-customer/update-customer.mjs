import shopify from "../../shopify.app.mjs";

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
    let customer = this.shopify._parseJSONStringObjects(this.customer);
    let response = await this.shopify.updateCustomer(this.customerId, customer);
    $.export("$summary", `Updated customer \`${response.email}\` with id \`${response.id}\``);
    return response;
  },
};
