import app from "../../paazl.app.mjs";

export default {
  key: "paazl-create-checkout-token",
  name: "Create Checkout Access Token",
  description: "Returns an access token for a checkout session. This enables the Paazl checkout widget to access Paazl resources. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Checkout/createTokenUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reference: {
      propDefinition: [
        app,
        "reference",
      ],
      description: "Your reference for the checkout session. If the reference value provided already exists, the existing session will be replaced with a new session.",
    },
  },
  async run({ $ }) {
    const {
      app,
      reference,
    } = this;

    const response = await app.createCheckoutToken({
      $,
      data: {
        reference,
      },
    });

    $.export("$summary", "Successfully created checkout token");
    return response;
  },
};
