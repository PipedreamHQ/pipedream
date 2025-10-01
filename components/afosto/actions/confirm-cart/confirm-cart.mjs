import { ConfigurationError } from "@pipedream/platform";
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
    const response = await this.app.confirmCart({
      $,
      variables: {
        cartId: this.cartId,
      },
    });

    if (response.errors) {
      throw new ConfigurationError(JSON.stringify(response.errors[0]));
    }

    $.export("$summary", `Successfully confirmed cart with ID: ${response.data.confirmCart.order.id}`);
    return response.data.confirmCart.order;
  },
};
