import shopify from "../../shopify.app.mjs";

export default {
  key: "shopify-get-customer",
  name: "Get Customer",
  description: "Retrieve a single customer by ID. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/queries/customer)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    shopify,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please verify that the Shopify shop has customer data properly defined and that your API credentials have been granted this access scope. [See the documentation](https://shopify.dev/docs/apps/launch/protected-customer-data)",
    },
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const { customer } = await this.shopify.getCustomer({
      id: this.customerId,
    });
    $.export("$summary", `Successfully retrieved customer \`${customer.email || customer.id}\``);
    return customer;
  },
};
