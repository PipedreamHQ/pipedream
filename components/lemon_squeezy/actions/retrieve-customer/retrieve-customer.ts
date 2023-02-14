import { defineAction } from "@pipedream/types";
import lemonSqueezy from "../../app/lemon_squeezy.app";

export default defineAction({
  name: "Retrieve A Customer",
  version: "0.0.1",
  key: "lemon_squeezy-retrieve-customer",
  description: "Retrive an existent customer. [See docs here](https://docs.lemonsqueezy.com/api/customers#retrieve-a-customer)",
  type: "action",
  props: {
    lemonSqueezy,
    customerId: {
      propDefinition: [
        lemonSqueezy,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const {
      customerId,
      lemonSqueezy,
    } = this;
    const response = await lemonSqueezy.retrieveCustomer({
      $,
      customerId,
    });

    $.export("$summary", `Customer with id ${customerId} was successfully fetched!`);
    return response;
  },
});
