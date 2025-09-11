import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-confirm-payment-intent",
  name: "Confirm A Payment Intent",
  type: "action",
  version: "0.1.3",
  description: "Confirm that your customer intends to pay with current or provided payment method. [See the documentation](https://stripe.com/docs/api/payment_intents/confirm).",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "info",
      content: "Upon confirmation, Stripe will attempt to initiate a payment. [See the documentation](https://stripe.com/docs/api/payment_intents/confirm).",
    },
    id: {
      propDefinition: [
        app,
        "paymentIntent",
      ],
      optional: false,
    },
    // Needed to populate the options for payment_method
    customer: {
      propDefinition: [
        app,
        "customer",
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
      label: "Receipt Email",
      description: "Email address that the receipt for the resulting payment will be sent to. If receipt_email is specified for a payment in live mode, a receipt will be sent regardless of your [email settings](https://dashboard.stripe.com/account/emails).",
      propDefinition: [
        app,
        "email",
      ],
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
    captureMethod: {
      type: "string",
      label: "Capture Method",
      description: "Controls when the funds will be captured from the customer's account.",
      options: [
        "automatic",
        "automatic_async",
        "manual",
      ],
      optional: true,
    },
    confirmationToken: {
      type: "string",
      label: "Confirmation Token",
      description: "ID of the ConfirmationToken used to confirm this PaymentIntent.",
      optional: true,
    },
    errorOnRequiresAction: {
      type: "boolean",
      label: "Error On Requires Action",
      description: "Set to true to fail the payment attempt if the PaymentIntent transitions into requires_action. This parameter is intended for simpler integrations that do not handle customer actions, like saving cards without authentication.",
      optional: true,
    },
    mandate: {
      type: "string",
      label: "Mandate",
      description: "ID of the mandate that's used for this payment.",
      optional: true,
    },
    mandateDataCustomerAcceptanceType: {
      type: "string",
      label: "Mandate Data - Customer Acceptance - Type",
      description: "The type of customer acceptance information included with the Mandate.",
      options: [
        "online",
        "offline",
      ],
      optional: true,
    },
    mandateDataCustomerAcceptanceAcceptedAt: {
      type: "string",
      label: "Mandate Data - Customer Acceptance - Accepted At",
      description: "The time at which the customer accepted the Mandate.",
      optional: true,
    },
    mandateDataCustomerAcceptanceOffline: {
      type: "object",
      label: "Mandate Data - Customer Acceptance - Offline",
      description: "If this is a Mandate accepted offline, this hash contains details about the offline acceptance.",
      optional: true,
    },
    mandateDataCustomerAcceptanceOnlineIpAddress: {
      type: "string",
      label: "Mandate Data - Customer Acceptance - Online - IP Address",
      description: "The IP address from which the Mandate was accepted by the customer.",
      optional: true,
    },
    mandateDataCustomerAcceptanceOnlineUserAgent: {
      type: "string",
      label: "Mandate Data - Customer Acceptance - Online - User Agent",
      description: "The user agent of the browser from which the Mandate was accepted by the customer.",
      optional: true,
    },
    offSession: {
      type: "boolean",
      label: "Off Session",
      description: "Set to true to indicate that the customer isn't in your checkout flow during this payment attempt and can't authenticate. Use this parameter in scenarios where you collect card details and charge them later.",
      optional: true,
    },
    paymentMethodData: {
      type: "object",
      label: "Payment Method Data",
      description: "If provided, this hash will be used to create a PaymentMethod. The new PaymentMethod will appear in the [payment_method](https://docs.stripe.com/api/payment_intents/object#payment_intent_object-payment_method) property on the PaymentIntent. [See the documentation](https://docs.stripe.com/api/payment_intents/confirm#confirm_payment_intent-payment_method_data).",
      optional: true,
    },
    paymentMethodOptions: {
      type: "object",
      label: "Payment Method Options",
      description: "Payment method-specific configuration for this PaymentIntent. [See the documentation](https://docs.stripe.com/api/payment_intents/confirm#confirm_payment_intent-payment_method_options).",
      optional: true,
    },
    paymentMethodTypes: {
      propDefinition: [
        app,
        "paymentMethodTypes",
      ],
    },
    radarOptionsSession: {
      type: "string",
      label: "Radar Options - Session",
      description: "A Radar Session is a snapshot of the browser metadata and device details that help Radar make more accurate predictions on your payments.",
      optional: true,
    },
    returnUrl: {
      type: "string",
      label: "Return URL",
      description: "The URL to redirect your customer back to after they authenticate or cancel their payment on the payment method's app or site. If you'd prefer to redirect to a mobile application, you can alternatively supply an application URI scheme. This parameter is only used for cards and other redirect-based payment methods.",
      optional: true,
    },
    useStripeSdk: {
      type: "boolean",
      label: "Use Stripe SDK",
      description: "Set to true when confirming server-side and using Stripe.js, iOS, or Android client-side SDKs to handle the next actions.",
      optional: true,
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
        mandateDataCustomerAcceptanceType,
        mandateDataCustomerAcceptanceAcceptedAt,
        mandateDataCustomerAcceptanceOffline,
        mandateDataCustomerAcceptanceOnlineIpAddress,
        mandateDataCustomerAcceptanceOnlineUserAgent,
        radarOptionsSession,
      } = this;

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

      const hasMandateData = mandateDataCustomerAcceptanceType
        || mandateDataCustomerAcceptanceAcceptedAt
        || mandateDataCustomerAcceptanceOffline;

      const hasOnlineData = mandateDataCustomerAcceptanceOnlineIpAddress
        || mandateDataCustomerAcceptanceOnlineUserAgent;

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
        ...(hasMandateData && {
          mandate_data: {
            customer_acceptance: {
              type: mandateDataCustomerAcceptanceType,
              accepted_at: mandateDataCustomerAcceptanceAcceptedAt,
              offline: mandateDataCustomerAcceptanceOffline,
              ...(hasOnlineData && {
                online: {
                  ip_address: mandateDataCustomerAcceptanceOnlineIpAddress,
                  user_agent: mandateDataCustomerAcceptanceOnlineUserAgent,
                },
              }),
            },
          },
        }),
        ...(radarOptionsSession && {
          radar_options: {
            session: radarOptionsSession,
          },
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
      paymentMethod,
      receiptEmail,
      setupFutureUsage,
      captureMethod,
      confirmationToken,
      errorOnRequiresAction,
      mandate,
      offSession,
      paymentMethodData,
      paymentMethodOptions,
      paymentMethodTypes,
      returnUrl,
      useStripeSdk,
      getOtherParams,
    } = this;

    const resp = await app.sdk().paymentIntents.confirm(id, {
      payment_method: paymentMethod,
      receipt_email: receiptEmail,
      setup_future_usage: setupFutureUsage,
      capture_method: captureMethod,
      confirmation_token: confirmationToken,
      error_on_requires_action: errorOnRequiresAction,
      mandate,
      off_session: offSession,
      payment_method_data: paymentMethodData,
      payment_method_options: utils.parseJson(paymentMethodOptions),
      payment_method_types: paymentMethodTypes,
      return_url: returnUrl,
      use_stripe_sdk: useStripeSdk,
      ...getOtherParams(),
    });
    $.export("$summary", "Successfully confirmed the payment intent");
    return resp;
  },
};
