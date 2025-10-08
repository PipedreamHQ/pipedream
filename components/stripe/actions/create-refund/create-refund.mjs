import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-refund",
  name: "Create A Refund",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a refund. [See the documentation](https://stripe.com/docs/api/refunds/create).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Creating a new refund will refund a charge that has previously been created but not yet refunded. Funds will be refunded to the credit or debit card that was originally charged. You can optionally refund only part of a charge. You can do so multiple times, until the entire charge has been refunded. Once entirely refunded, a charge can't be refunded again. [See the documentation](https://stripe.com/docs/api/refunds/create).",
    },
    charge: {
      propDefinition: [
        app,
        "charge",
      ],
    },
    paymentIntent: {
      propDefinition: [
        app,
        "paymentIntent",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "String indicating the reason for the refund. If you believe the charge to be fraudulent, specifying fraudulent as the reason will add the associated card and email to your [block lists](https://docs.stripe.com/radar/lists), and will also help us improve our fraud detection algorithms.",
      options: [
        "duplicate",
        "fraudulent",
        "requested_by_customer",
      ],
      optional: true,
    },
    refundApplicationFee: {
      type: "boolean",
      label: "Refund Application Fee",
      description: "Whether the application fee should be refunded when refunding this charge. If a full charge refund is given, the full application fee will be refunded. Otherwise, the application fee will be refunded in an amount proportional to the amount of the charge refunded. Note that an application fee can be refunded only by the application that created the charge.",
      optional: true,
    },
    reverseTransfer: {
      type: "boolean",
      label: "Reverse Transfer",
      description: "Whether the transfer should be reversed when refunding this charge. The transfer will be reversed proportionally to the amount being refunded (either the entire or partial amount). A transfer can be reversed only by the application that created the charge.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      charge,
      paymentIntent,
      amount,
      reason,
      refundApplicationFee,
      reverseTransfer,
      metadata,
    } = this;

    const resp = await app.sdk().refunds.create({
      charge,
      payment_intent: paymentIntent,
      amount,
      reason,
      refund_application_fee: refundApplicationFee,
      reverse_transfer: reverseTransfer,
      metadata,
    });
    $.export("$summary", `Successfully created a refund for \`${resp.amount}\` of the smallest currency unit of \`${resp.currency}\`.`);
    return resp;
  },
};
