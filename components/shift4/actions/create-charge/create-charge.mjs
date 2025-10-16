import { ConfigurationError } from "@pipedream/platform";
import { TYPE_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import shift4 from "../../shift4.app.mjs";

export default {
  key: "shift4-create-charge",
  name: "Create Charge",
  description: "Creates a new charge object. [See the documentation](https://dev.shift4.com/docs/api#charges-create-a-new-charge)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shift4,
    customerId: {
      propDefinition: [
        shift4,
        "customerId",
      ],
      optional: true,
    },
    amount: {
      propDefinition: [
        shift4,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        shift4,
        "currency",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the charge.",
      options: TYPE_OPTIONS,
      optional: true,
    },
    description: {
      propDefinition: [
        shift4,
        "description",
      ],
      optional: true,
    },
    card: {
      propDefinition: [
        shift4,
        "card",
      ],
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Payment method details or identifier.",
      optional: true,
    },
    flow: {
      type: "object",
      label: "Flow",
      description: "Details specific to the payment method charge.",
      optional: true,
    },
    captured: {
      type: "boolean",
      label: "Captured",
      description: "Whether this charge should be immediately captured.",
      optional: true,
    },
    shipping: {
      type: "object",
      label: "Shipping",
      description: "Shipping details. Sample object: `{name: \"string\", address: {line1: \"string\", line2: \"string\", zip: \"string\", city: \"string\", state: \"string\", country: \"country represented as two-letter ISO country code\"}}`",
      optional: true,
    },
    billing: {
      type: "object",
      label: "Billing",
      description: "Billing details. Sample object: `{name: \"string\", email: \"string\", address: {line1: \"string\", line2: \"string\", zip: \"string\", city: \"string\", state: \"string\", country: \"country represented as two-letter ISO country code\"}, vat: \"string\"}`",
      optional: true,
    },
    threeDSecure: {
      type: "object",
      label: "3D Secure",
      description: "3D Secure options.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        shift4,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.customerId && !this.card && !this.paymentMethod) {
      throw new ConfigurationError("Either **CustomerId**, **Card** or **PaymentMethod** is required!");
    }

    try {
      const response = await this.shift4.createCharge({
        $,
        data: {
          amount: this.amount,
          currency: this.currency,
          type: this.type,
          description: this.description,
          customerId: this.customerId,
          card: this.card && parseObject(this.card),
          paymentMethod: this.paymentMethod && parseObject(this.paymentMethod),
          flow: this.flow && parseObject(this.flow),
          captured: this.captured,
          shipping: this.shipping && parseObject(this.shipping),
          billing: this.billing && parseObject(this.billing),
          threeDSecure: this.threeDSecure && parseObject(this.threeDSecure),
          metadata: this.metadata && parseObject(this.metadata),
        },
      });

      $.export("$summary", `Successfully created charge with Id: ${response.id}`);
      return response;
    } catch ({ message }) {
      throw new ConfigurationError(JSON.parse(message).error.message);
    }
  },
};
