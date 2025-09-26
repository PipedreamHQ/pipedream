import app from "../../afosto.app.mjs";

export default {
  key: "afosto-add-item-to-cart",
  name: "Add Item to Cart",
  description: "Add an item to a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/integration/add-and-remove-items/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    sku: {
      type: "string",
      label: "SKU",
      description: "The SKU of the item to add to the cart.",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of the item to add to the cart.",
    },
    cartId: {
      propDefinition: [
        app,
        "cartId",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.query({
        $,
        data: JSON.stringify({
          query: `mutation AddItemToCart(
            $input: AddItemsToCartInput!
          ) {
            addItemsToCart(input: $input) {
              cart {
                id
                items {
                  ids
                  label
                  brand
                  mpn
                  gtin
                  image
                  hs_code
                  country_of_origin
                  url
                  sku
                  quantity
                  subtotal
                  total
                  parent_id
                }
              }
            }
          }`,
          variables: {
            input: {
              cart_id: this.cartId,
              items: [
                {
                  sku: this.sku,
                  quantity: this.quantity,
                },
              ],
            },
          },
        }),
      });

      $.export("$summary", `Successfully added item to cart with SKU: ${response.data.addItemsToCart.cart.items[0].sku}`);
      return response.data.addItemsToCart.cart;
    } catch ({ response }) {
      throw new Error(`${response.data?.errors?.[0]?.message}`);
    }
  },
};
