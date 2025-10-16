import { ConfigurationError } from "@pipedream/platform";
import app from "../../afosto.app.mjs";

export default {
  key: "afosto-add-note-to-cart",
  name: "Add Note to Cart",
  description: "Add a note to a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/checkout-summary/)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    cartId: {
      propDefinition: [
        app,
        "cartId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The note to add to the cart",
    },
  },
  async run({ $ }) {
    const variables = {
      cartId: this.cartId,
      note: this.note,
    };

    const response = await this.app.addNoteToCart({
      $,
      variables,
    });

    if (response.errors) {
      throw new ConfigurationError(JSON.stringify(response.errors[0]));
    }

    $.export("$summary", `Successfully added note to cart with ID: ${this.cartId}`);
    return response.data.setNoteForCart.cart;
  },
};
