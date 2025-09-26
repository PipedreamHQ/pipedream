import app from "../../afosto.app.mjs";

export default {
  key: "afosto-confirm-cart",
  name: "Confirm Cart",
  description: "Confirm a cart. [See the documentation](https://afosto.com/docs/developers/storefront-js-client/custom-checkout/payment-process/)",
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
  },
  async run({ $ }) {
    try {
      const response = await this.app.query({
        $,
        data: JSON.stringify({
          query: `mutation ConfirmCart (
              $cartId: String!
            ) {
              confirmCart(input: { cart_id: $cartId }) {
                order {
                  id
                }
              }
            }
          `,
          variables: {
            cartId: this.cartId,
          },
        }),
      });

      $.export("$summary", `Successfully confirmed cart with ID: ${response.data.confirmCart.order.id}`);
      return response.data.confirmCart.order;
    } catch ({ response }) {
      throw new Error(`${response.data?.errors?.[0]?.message}`);
    }
  },
};
