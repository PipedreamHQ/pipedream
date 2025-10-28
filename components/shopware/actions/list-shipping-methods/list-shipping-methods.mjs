import shopware from "../../shopware.app.mjs";

export default {
  key: "shopware-list-shipping-methods",
  name: "List Shipping Methods",
  description: "List all shipping methods. [See the documentation](https://shopware.stoplight.io/docs/admin-api/7d33c6b3c151d-list-with-basic-information-of-shipping-method-resources)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopware,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of shipping methods to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.shopware.paginate({
      $,
      fn: this.shopware.listShippingMethods,
      maxResults: this.maxResults,
    });

    const data = [];
    for await (const shippingMethod of response) {
      data.push(shippingMethod);
    }

    $.export("$summary", `Successfully retrieved ${data.length} shipping methods`);
    return data;
  },
};
