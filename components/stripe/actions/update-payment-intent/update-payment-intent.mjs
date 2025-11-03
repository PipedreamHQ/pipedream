import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-update-payment-intent",
  name: "Update a Payment Intent",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a payment intent. [See the documentation](https://stripe.com/docs/api/payment_intents/update).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "paymentIntent",
      ],
      optional: false,
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
      default: "", // currency cannot be used when modifying a PaymentIntent that was created by an invoice
    },
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
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
    paymentMethod: {
      propDefinition: [
        app,
        "paymentMethod",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    receiptEmail: {
      type: "string",
      label: "Receipt Email",
      description: "Email address that the receipt for the resulting payment will be sent to. If receipt_email is specified for a payment in live mode, a receipt will be sent regardless of your email settings.",
    },
    setupFutureUsage: {
      propDefinition: [
        app,
        "setupFutureUsage",
      ],
    },
    shippingAddressCity: {
      label: "Shipping - Address - City",
      propDefinition: [
        app,
        "addressCity",
      ],
    },
    shippingAddressCountry: {
      label: "Shipping - Address - Country",
      propDefinition: [
        app,
        "addressCountry",
      ],
    },
    shippingAddressLine1: {
      label: "Shipping - Address - Line 1",
      propDefinition: [
        app,
        "addressLine1",
      ],
    },
    shippingAddressLine2: {
      label: "Shipping - Address - Line 2",
      propDefinition: [
        app,
        "addressLine2",
      ],
    },
    shippingAddressPostalCode: {
      label: "Shipping - Address - Postal Code",
      propDefinition: [
        app,
        "addressPostalCode",
      ],
    },
    shippingAddressState: {
      label: "Shipping - Address - State",
      propDefinition: [
        app,
        "addressState",
      ],
    },
    shippingName: {
      propDefinition: [
        app,
        "shippingName",
      ],
    },
    shippingCarrier: {
      propDefinition: [
        app,
        "shippingCarrier",
      ],
    },
    shippingPhone: {
      propDefinition: [
        app,
        "shippingPhone",
      ],
    },
    shippingTrackingNumber: {
      propDefinition: [
        app,
        "shippingTrackingNumber",
      ],
    },
    statementDescriptor: {
      propDefinition: [
        app,
        "statementDescriptor",
      ],
    },
    statementDescriptorSuffix: {
      propDefinition: [
        app,
        "statementDescriptorSuffix",
      ],
    },
    paymentMethodTypes: {
      propDefinition: [
        app,
        "paymentMethodTypes",
      ],
    },
  },
  methods: {
    getOtherParams() {
      const {
        shippingAddressCity,
        shippingAddressCountry,
        shippingAddressLine1,
        shippingAddressLine2,
        shippingAddressPostalCode,
        shippingAddressState,
        shippingName,
        shippingCarrier,
        shippingPhone,
        shippingTrackingNumber,
        statementDescriptor,
        statementDescriptorSuffix,
      } = this;

      // Add shipping if any shipping field is provided
      const hasShippingData = shippingAddressCity
        || shippingAddressCountry
        || shippingAddressLine1
        || shippingAddressLine2
        || shippingAddressPostalCode
        || shippingAddressState
        || shippingName
        || shippingCarrier
        || shippingPhone
        || shippingTrackingNumber;

      return {
        ...(hasShippingData && {
          shipping: {
            address: {
              city: shippingAddressCity,
              country: shippingAddressCountry,
              line1: shippingAddressLine1,
              line2: shippingAddressLine2,
              postal_code: shippingAddressPostalCode,
              state: shippingAddressState,
            },
            name: shippingName,
            carrier: shippingCarrier,
            phone: shippingPhone,
            tracking_number: shippingTrackingNumber,
          },
        }),
        ...(statementDescriptor && {
          statement_descriptor: statementDescriptor?.slice(0, 21) || undefined,
        }),
        ...(statementDescriptorSuffix && {
          statement_descriptor_suffix: statementDescriptorSuffix?.slice(0, 21) || undefined,
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
      amount,
      currency,
      customer,
      description,
      metadata,
      paymentMethod,
      receiptEmail,
      setupFutureUsage,
      paymentMethodTypes,
    } = this;

    const resp = await app.sdk().paymentIntents.update(id, {
      amount,
      currency,
      metadata: utils.parseJson(metadata),
      customer,
      description,
      payment_method: paymentMethod,
      receipt_email: receiptEmail,
      setup_future_usage: setupFutureUsage,
      payment_method_types: paymentMethodTypes,
      ...this.getOtherParams(),
    });
    $.export("$summary", `Successfully updated the payment intent, \`${resp.description || resp.id}\`.`);
    return resp;
  },
};
