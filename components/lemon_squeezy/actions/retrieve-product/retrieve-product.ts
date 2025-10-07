import { defineAction } from "@pipedream/types";
import lemonSqueezy from "../../app/lemon_squeezy.app";

export default defineAction({
  name: "Retrieve A Product",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "lemon_squeezy-retrieve-product",
  description: "Retrive an existent product. [See docs here](https://docs.lemonsqueezy.com/api/products#retrieve-a-product)",
  type: "action",
  props: {
    lemonSqueezy,
    productId: {
      propDefinition: [
        lemonSqueezy,
        "productId",
      ],
    },
  },
  async run({ $ }) {
    const {
      productId,
      lemonSqueezy,
    } = this;
    const response = await lemonSqueezy.retrieveProduct({
      $,
      productId,
    });

    $.export("$summary", `Product with id ${productId} was successfully fetched!`);
    return response;
  },
});
