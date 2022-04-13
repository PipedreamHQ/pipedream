import { axios } from "@pipedream/platform";
const stripe = require("../../stripe.app.js");

export default {
  name: "Retrieve Product",
  description: "Retrieve a product by ID. [See the docs](https://stripe.com/docs/api/products/retrieve)",
  key: "retrieve_product",
  version: "0.0.1",
  type: "action",
  props: {
    stripe,
    product_id: {
      type: "string",
      label: "Product ID",
      description: "A Stripe Product ID. [See the docs](https://stripe.com/docs/api/products/object#product_object-id)",
      optional: false,
    },
  },
  async run ({ $ }) {
    const resp = await axios($, {
      url: `https://api.stripe.com/v1/products/${this.product_id}`,
      auth: {
        username: `${this.stripe.$auth.api_key}`,
        password: "",
      },
    });
    $.export("$summary", `Successfully retrieved the line item product, "${resp.name || resp.id}"`);
    return resp;
  },
};
