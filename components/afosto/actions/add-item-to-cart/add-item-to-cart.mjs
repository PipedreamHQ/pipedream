import { ConfigurationError } from "@pipedream/platform";
import app from "../../afosto.app.mjs";

export default {
  key: "afosto-add-item-to-cart",
  name: "Add Item to Cart",
  description: "Add an item to a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/integration/add-and-remove-items/)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.app.addItemToCart({
      $,
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
    });

    if (response.errors) {
      throw new ConfigurationError(JSON.stringify(response.errors[0]));
    }
    $.export("$summary", `Successfully added item to cart with SKU: ${response.data.addItemsToCart.cart.items[0].sku}`);
    return response.data.addItemsToCart.cart;
  },
};
