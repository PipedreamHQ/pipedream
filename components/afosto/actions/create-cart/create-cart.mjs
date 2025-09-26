import app from "../../afosto.app.mjs";

export default {
  key: "afosto-create-cart",
  name: "Create Cart",
  description: "Create a new cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/integration/create-a-cart/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    try {
      const response = await this.app.query({
        $,
        data: JSON.stringify({
          query: `mutation createCart {
            createCart(input: {}) {
              cart {
                id
                number
                total
                subtotal
                total_excluding_vat
                currency
                is_including_vat
                is_vat_shifted
                created_at
              }
            }
          }`,
        }),
      });

      $.export("$summary", `Successfully created cart with ID: ${response.data.createCart.cart.id}`);
      return response.data.createCart.cart;
    } catch ({ response }) {
      throw new Error(`${response.data?.errors?.[0]?.message}`);
    }
  },
};
