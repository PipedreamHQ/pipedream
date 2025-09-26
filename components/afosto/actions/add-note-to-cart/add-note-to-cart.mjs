import app from "../../afosto.app.mjs";

export default {
  key: "afosto-add-note-to-cart",
  name: "Add Note to Cart",
  description: "Add a note to a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/checkout-summary/)",
  version: "0.0.1",
  type: "action",
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
    try {
      const variables = {
        cartId: this.cartId,
        note: this.note,
      };

      const response = await this.app.query({
        $,
        maxBodyLength: Infinity,
        headers: {
          "DisablePreParseMultipartForm": "true",
        },
        data: JSON.stringify({
          query: `mutation SetNoteForCart (
            $cartId: String!
            $note: String!
          ) {
            setNoteForCart(input: { cart_id: $cartId, note: $note }) {
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
                updated_at
              }
            }
          }`,
          variables,
        }),
      });

      $.export("$summary", `Successfully added note to cart with ID: ${this.cartId}`);
      return response.data.setNoteForCart.cart;
    } catch (error) {
      throw new Error(`${error.errors?.[0]?.message || "An unknown error occurred"}`);
    }
  },
};
