import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-checkout-session",
  name: "Get Checkout Session Data",
  description: "Gets your reference for a checkout session. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Checkout/getCheckoutUsingGET)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reference: {
      propDefinition: [
        app,
        "reference",
      ],
      description: "Your reference for the checkout session whose details you want to retrieve. The reference is the one you used when you created an access token with the token endpoint.",
    },
  },
  async run({ $ }) {
    const {
      app,
      reference,
    } = this;

    const response = await app.getCheckoutSession({
      $,
      params: {
        reference,
      },
    });

    $.export("$summary", "Successfully retrieved checkout session data");
    return response;
  },
};
