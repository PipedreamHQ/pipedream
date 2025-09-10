import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-update-invoice",
  name: "Update Invoice",
  type: "action",
  version: "0.1.3",
  description: "Update an invoice. [See the documentation](https://stripe.com/docs/api/invoices/update).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "invoice",
      ],
      optional: false,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    autoAdvance: {
      propDefinition: [
        app,
        "autoAdvance",
      ],
    },
    collectionMethod: {
      description: "Either charge_automatically or send_invoice. This field can be updated only on draft invoices.",
      propDefinition: [
        app,
        "collectionMethod",
      ],
    },
    daysUntilDue: {
      description: "The number of days from which the invoice is created until it is due. Only valid for invoices where `collection_method=send_invoice`. This field can only be updated on draft invoices.",
      propDefinition: [
        app,
        "daysUntilDue",
      ],
    },
    paymentMethodType: {
      type: "string",
      label: "Payment Method Type",
      description: "The type of payment method to create",
      propDefinition: [
        app,
        "paymentMethodTypes",
      ],
    },
    defaultPaymentMethod: {
      propDefinition: [
        app,
        "paymentMethod",
        ({ paymentMethodType }) => ({
          type: paymentMethodType,
        }),
      ],
      label: "Default Payment Method",
      description: "Must belong to the customer associated with the invoice. If not set, " +
        "defaults to the subscription’s default payment method, if any, or to the default " +
        "payment method in the customer’s invoice settings.",
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
      id,
      description,
      autoAdvance,
      collectionMethod,
      daysUntilDue,
      defaultPaymentMethod,
      metadata,
    } = this;

    const resp = await app.sdk().invoices.update(id, {
      description,
      auto_advance: autoAdvance,
      collection_method: collectionMethod,
      days_until_due: daysUntilDue,
      default_payment_method: defaultPaymentMethod,
      metadata: utils.parseJson(metadata),
    });
    $.export("$summary", `Successfully updated the invoice, \`${resp.number || resp.id}\`.`);
    return resp;
  },
};
