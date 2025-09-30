import app from "../../stripe.app.mjs";

export default {
  name: "Retrieve Product",
  description: "Retrieve a product by ID. [See the documentation](https://stripe.com/docs/api/products/retrieve).",
  key: "stripe-retrieve-product",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    productId: {
      type: "string",
      label: "Product ID",
      description: "A Stripe Product ID. [See the documentation](https://stripe.com/docs/api/products/object#product_object-id)",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.sdk().products.retrieve(this.productId);
    $.export("$summary", `Successfully retrieved the line item product, \`${resp.name || resp.id}\`.`);
    return resp;
  },
};
