import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-list-shipping-products",
  name: "List Shipping Products",
  description: "Returns all shipping product options available in Returnista, including carrier integrations, label types, and product codes."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/shipping-products)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    returnista,
  },
  async run({ $ }) {
    const response = await this.returnista.getShippingProducts({
      $,
    });
    const products = response?.data ?? [];
    $.export("$summary", `Retrieved ${products.length} shipping product(s)`);
    return products;
  },
};
