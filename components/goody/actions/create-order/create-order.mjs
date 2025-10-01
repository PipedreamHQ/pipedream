import goody from "../../goody.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "goody-create-order",
  name: "Create Order",
  description: "Creates a new order in Goody. [See the documentation](https://developer.ongoody.com/api-reference/order-batches/create-an-order-batch)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    goody,
    productId: {
      propDefinition: [
        goody,
        "productId",
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Quantity of the product to order",
    },
    sendMethod: {
      type: "string",
      label: "Send Method",
      description: "The method for sending the order",
      options: constants.SEND_METHODS,
    },
    paymentMethodId: {
      propDefinition: [
        goody,
        "paymentMethodId",
      ],
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "The name of the sender of the order (typically a gift), to be displayed as \"from\".",
    },
    recipientFirstName: {
      type: "string",
      label: "Recipient First Name",
      description: "First name of the recipient",
    },
    recipientLastName: {
      type: "string",
      label: "Recipient Last Name",
      description: "Last name of the recipient",
      optional: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "Email address of the recipient",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "Street address of the recipient",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Line 2 of the street address of the recipient",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the recipient",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the recipient",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the recipient",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "For gifts, a message for the gift to be displayed in the digital unwrapping and email notifications, if enabled.",
      optional: true,
    },
    variablePrice: {
      type: "integer",
      label: "Variable Price",
      description: "If this product has a variable price (e.g. a flex gift or a gift card), then this must be provided. A positive integer represented in cents.",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((this.address1 || this.city || this.state || this.postalCode)
      && !(this.address1 && this.city && this.state && this.postalCode)) {
      throw new ConfigurationError("If specifying a recipient address, street, city, state, and postal code are required.");
    }

    const response = await this.goody.createOrder({
      data: {
        from_name: this.fromName,
        message: this.message,
        recipients: [
          {
            first_name: this.recipientFirstName,
            last_name: this.recipientLastName,
            email: this.recipientEmail,
            mailing_address: this.address1
              ? {
                first_name: this.recipientFirstName,
                last_name: this.recipientLastName,
                address_1: this.address1,
                address_2: this.address2,
                city: this.city,
                state: this.state,
                postal_code: this.postalCode,
                country: "US",
              }
              : undefined,
          },
        ],
        cart: {
          items: [
            {
              product_id: this.productId,
              quantity: this.quantity,
              variable_price: this.variablePrice,
            },
          ],
        },
        send_method: this.sendMethod,
        payment_method_id: this.paymentMethodId,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created order with ID ${response.id}.`);
    }

    return response;
  },
};
