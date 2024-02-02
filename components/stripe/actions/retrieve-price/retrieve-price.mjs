import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-price",
  name: "Retrieve a Price",
  type: "action",
  version: "0.1.0",
  description: "Retrieves the details of an existing product price. [See the " +
    "docs](https://stripe.com/docs/api/prices/retrieve) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "price",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().prices.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the price, "${resp.nickname || resp.id}"`);
    return resp;
  },
};
