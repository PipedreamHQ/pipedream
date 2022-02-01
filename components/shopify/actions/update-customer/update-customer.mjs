import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-update-customer",
  name: "Update Customer",
  description: "Update a existing customer. [See the docs](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[put]/admin/api/2022-01/customers/{customer_id}.json)",
  version: "0.0.1",
  type: "action",
  props: {
    shopify,
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
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
