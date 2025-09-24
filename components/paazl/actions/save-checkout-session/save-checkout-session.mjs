import app from "../../paazl.app.mjs";

export default {
  key: "paazl-save-checkout-session",
  name: "Save Checkout Session Data",
  description: "Saves the most important information of a specific checkout session to the Paazl database. The information will be kept for 30 days. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Checkout/saveCheckoutUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    token: {
      type: "string",
      label: "Token",
      description: "The access token returned by the token endpoint",
    },
    consigneeCountryCode: {
      propDefinition: [
        app,
        "consigneeCountryCode",
      ],
    },
    shippingOptionIdentifier: {
      optional: false,
      propDefinition: [
        app,
        "shippingOptionId",
        ({
          token, consigneeCountryCode,
        }) => ({
          token,
          consigneeCountryCode,
        }),
      ],
    },
    pickupLocationCode: {
      propDefinition: [
        app,
        "pickupLocationCode",
      ],
    },
    pickupLocationAccountNumber: {
      type: "string",
      label: "Pickup Location Account Number",
      description: "An account number that a carrier can issue to customers for managing delivery of their parcel to a collection point",
      optional: true,
    },
    preferredDeliveryDate: {
      type: "string",
      label: "Preferred Delivery Date",
      description: "The day on which customers want their order delivered (format: `YYYY-MM-DD`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      token,
      shippingOptionIdentifier,
      pickupLocationCode,
      pickupLocationAccountNumber,
      preferredDeliveryDate,
    } = this;

    const response = await app.saveCheckoutSession({
      $,
      data: {
        token,
        shippingOption: {
          identifier: shippingOptionIdentifier,
        },
        preferredDeliveryDate,
        ...(pickupLocationCode
          || pickupLocationAccountNumber
          ? {
            pickupLocation: {
              code: pickupLocationCode,
              accountNumber: pickupLocationAccountNumber,
            },
          }
          : {}
        ),
      },
    });

    $.export("$summary", "Successfully saved checkout session data");
    return response;
  },
};
