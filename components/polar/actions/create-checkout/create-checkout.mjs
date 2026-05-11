import app from "../../polar.app.mjs";

export default {
  key: "polar-create-checkout",
  name: "Create Checkout",
  description: "Create a checkout session for one or more products. [See the API docs](https://polar.sh/docs/api-reference/checkouts/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    products: {
      type: "string[]",
      label: "Products",
      description: "List of product IDs available to select at checkout. The first product is selected by default.",
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "Pre-fill the customer's email address in the checkout form.",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "Pre-fill the customer's name in the checkout form.",
      optional: true,
    },
    externalCustomerId: {
      type: "string",
      label: "External Customer ID",
      description: "Customer ID from your system. If a matching Polar customer exists, the order is linked to it.",
      optional: true,
    },
    successUrl: {
      type: "string",
      label: "Success URL",
      description: "URL where the customer will be redirected after a successful payment. You can include `checkout_id={CHECKOUT_ID}`.",
      optional: true,
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "URL used by the checkout back button.",
      optional: true,
    },
    allowDiscountCodes: {
      type: "boolean",
      label: "Allow Discount Codes",
      description: "Whether customers can apply discount codes during checkout.",
      optional: true,
    },
    requireBillingAddress: {
      type: "boolean",
      label: "Require Billing Address",
      description: "Whether customers must fill their full billing address.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value data copied to the resulting order or subscription. Example: `{ \"source\": \"pipedream\", \"campaign\": \"spring_launch\" }`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const checkout = await this.app.createCheckout({
      products: this.products,
      customerId: this.customerId,
      customerEmail: this.customerEmail,
      customerName: this.customerName,
      externalCustomerId: this.externalCustomerId,
      successUrl: this.successUrl,
      returnUrl: this.returnUrl,
      allowDiscountCodes: this.allowDiscountCodes,
      requireBillingAddress: this.requireBillingAddress,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created checkout${checkout?.id
      ? ` with ID ${checkout.id}`
      : ""}`);
    return checkout;
  },
};
