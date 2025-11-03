import app from "../../stripe.app.mjs";

export default {
  key: "stripe-capture-payment-intent",
  name: "Capture a Payment Intent",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Capture the funds of an existing uncaptured payment intent. [See the documentation](https://stripe.com/docs/api/payment_intents/capture).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Use this Pipedream component to capture funds from an existing PaymentIntent if its status is `requires_capture`. Be aware that uncaptured PaymentIntents will automatically cancel after a certain period (typically 7 days), so ensure timely capture. This process is part of a separate authorization and capture flow for payments. [See the documentation](https://stripe.com/docs/api/payment_intents/capture).",
    },
    id: {
      propDefinition: [
        app,
        "paymentIntent",
      ],
      optional: false,
    },
    amountToCapture: {
      description: "The amount to capture from the PaymentIntent, which must be less than or equal to the original amount. Defaults to the full `amount_capturable` if it's not provided.",
      propDefinition: [
        app,
        "amount",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    applicationFeeAmount: {
      type: "integer",
      label: "Application Fee Amount",
      description: "The amount of the application fee (if any) that will be requested to be applied to the payment and transferred to the application owner’s Stripe account. The amount of the application fee collected will be capped at the total amount captured. For more information, see the PaymentIntents use case for connected accounts.",
      optional: true,
    },
    finalCapture: {
      type: "boolean",
      label: "Final Capture",
      description: "When capturing a PaymentIntent, setting final_capture to false notifies Stripe to not release the remaining uncaptured funds to make sure that they're captured in future requests. You can only use this setting when multicapture is available for PaymentIntents.",
      optional: true,
    },
    statementDescriptor: {
      propDefinition: [
        app,
        "statementDescriptor",
      ],
    },
    statementDescriptorSuffix: {
      type: "string",
      label: "Statement Descriptor Suffix",
      description: "Provides information about a card charge. Concatenated to the account’s statement descriptor prefix to form the complete statement descriptor that appears on the customer’s statement.",
      optional: true,
    },
    transferDataAmount: {
      type: "integer",
      label: "Transfer Data Amount",
      description: "The amount that will be transferred automatically when a charge succeeds.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      id,
      amountToCapture,
      metadata,
      applicationFeeAmount,
      finalCapture,
      statementDescriptor,
      statementDescriptorSuffix,
      transferDataAmount,
    } = this;

    const resp = await this.app.sdk().paymentIntents.capture(id, {
      amount_to_capture: amountToCapture,
      metadata,
      application_fee_amount: applicationFeeAmount,
      final_capture: finalCapture,
      statement_descriptor: statementDescriptor,
      statement_descriptor_suffix: statementDescriptorSuffix,
      ...(transferDataAmount && {
        transfer_data: {
          amount: transferDataAmount,
        },
      }),
    });
    $.export("$summary", `Successfully captured ${amountToCapture
      ? amountToCapture
      : `the full ${resp.amount_capturable}`} from the payment intent`);
    return resp;
  },
};
