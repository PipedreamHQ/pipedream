import { ConfigurationError } from "@pipedream/platform";
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
    const response = await this.app.createCart({
      $,
    });

    if (response.errors) {
      throw new ConfigurationError(JSON.stringify(response.errors[0]));
    }

    $.export("$summary", `Successfully created cart with ID: ${response.data.createCart.cart.id}`);
    return response.data.createCart.cart;
  },
};
