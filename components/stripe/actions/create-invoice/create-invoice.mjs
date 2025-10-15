import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-invoice",
  name: "Create Invoice",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create an invoice. [See the documentation](https://stripe.com/docs/api/invoices/create).",
  props: {
    app,
    autoAdvance: {
      propDefinition: [
        app,
        "autoAdvance",
      ],
    },
    automaticTaxEnabled: {
      type: "boolean",
      label: "Automatic Tax Enabled",
      description: "Whether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified tax rates, negative amounts, or tax_behavior=unspecified) cannot be added to automatic tax invoices.",
      optional: true,
    },
    automaticTaxLiabilityType: {
      type: "string",
      label: "Automatic Tax Liability Type",
      description: "Type of the account referenced in the request.",
      options: [
        "account",
        "self",
      ],
      optional: true,
    },
    automaticTaxLiabilityAccount: {
      type: "string",
      label: "Automatic Tax Liability Account",
      description: "The connected account being referenced when type is account.",
      optional: true,
    },
    collectionMethod: {
      propDefinition: [
        app,
        "collectionMethod",
      ],
    },
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    daysUntilDue: {
      description: "The number of days from when the invoice is created until it is due. Valid only for invoices where `collection_method=send_invoice`.",
      propDefinition: [
        app,
        "daysUntilDue",
      ],
    },
    defaultPaymentMethod: {
      label: "Default Payment Method",
      description: "Must belong to the customer associated with the invoice. If not set, defaults to the subscription's default payment method, if any, or to the default payment method in the customer's invoice settings.",
      propDefinition: [
        app,
        "paymentMethod",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      autoAdvance,
      automaticTaxEnabled,
      automaticTaxLiabilityType,
      automaticTaxLiabilityAccount,
      collectionMethod,
      customer,
      description,
      metadata,
      subscription,
      daysUntilDue,
      defaultPaymentMethod,
    } = this;
    const resp = await app.sdk().invoices.create({
      auto_advance: autoAdvance,
      ...(
        automaticTaxEnabled
        || automaticTaxLiabilityType
        || automaticTaxLiabilityAccount
          ? {
            automatic_tax: {
              enabled: automaticTaxEnabled,
              liability: {
                type: automaticTaxLiabilityType,
                account: automaticTaxLiabilityAccount,
              },
            },
          }
          : {}
      ),
      collection_method: collectionMethod,
      customer,
      description,
      metadata,
      subscription,
      days_until_due: daysUntilDue,
      default_payment_method: defaultPaymentMethod,
    });

    $.export("$summary", "Successfully created a new invoice");

    return resp;
  },
};
