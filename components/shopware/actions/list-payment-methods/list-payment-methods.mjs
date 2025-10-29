import shopware from "../../shopware.app.mjs";

export default {
  key: "shopware-list-payment-methods",
  name: "List Payment Methods",
  description: "List all payment methods. [See the documentation](https://shopware.stoplight.io/docs/admin-api/0ffc5a34d40e4-list-with-basic-information-of-payment-method-resources)",
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
      description: "The maximum number of payment methods to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.shopware.paginate({
      $,
      fn: this.shopware.listPaymentMethods,
      maxResults: this.maxResults,
    });

    const data = [];
    for await (const paymentMethod of response) {
      data.push(paymentMethod);
    }

    $.export("$summary", `Successfully retrieved ${data.length} payment methods`);
    return data;
  },
};
