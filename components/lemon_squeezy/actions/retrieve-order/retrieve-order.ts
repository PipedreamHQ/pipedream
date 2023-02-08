import { defineAction } from "@pipedream/types";
import lemonSqueezy from "../../app/lemon_squeezy.app";

export default defineAction({
  name: "Retrieve An Order",
  version: "0.0.1",
  key: "lemon_squeezy-retrieve-order",
  description: "Retrive an existent order. [See docs here](https://docs.lemonsqueezy.com/api/orders#retrieve-an-order)",
  type: "action",
  props: {
    lemonSqueezy,
    orderId: {
      propDefinition: [
        lemonSqueezy,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const {
      orderId,
      lemonSqueezy,
    } = this;
    const response = await lemonSqueezy.retrieveOrder({
      $,
      orderId,
    });

    $.export("$summary", `Order with id ${orderId} was successfully fetched!`);
    return response;
  },
});
