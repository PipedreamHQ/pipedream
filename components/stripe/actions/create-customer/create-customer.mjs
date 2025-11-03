import app from "../../stripe.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "stripe-create-customer",
  name: "Create a Customer",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a customer. [See the documentation](https://stripe.com/docs/api/customers/create).",
  props: {
    app,
    name: {
      description: "The customer's full name or business name.",
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    addressCity: {
      propDefinition: [
        app,
        "addressCity",
      ],
    },
    addressCountry: {
      propDefinition: [
        app,
        "addressCountry",
      ],
    },
    addressLine1: {
      propDefinition: [
        app,
        "addressLine1",
      ],
    },
    addressLine2: {
      propDefinition: [
        app,
        "addressLine2",
      ],
    },
    addressPostalCode: {
      propDefinition: [
        app,
        "addressPostalCode",
      ],
    },
    addressState: {
      propDefinition: [
        app,
        "addressState",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
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
    paymentMethod: {
      propDefinition: [
        app,
        "paymentMethod",
        ({ paymentMethodType }) => ({
          type: paymentMethodType,
        }),
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
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
    shippingPhone: {
      propDefinition: [
        app,
        "shippingPhone",
      ],
    },
    taxIpAddress: {
      type: "string",
      label: "Tax - IP Address",
      description: "A recent IP address of the customer used for tax reporting and tax location inference. Stripe recommends updating the IP address when a new PaymentMethod is attached or the address field on the customer is updated. We recommend against updating this field more frequently since it could result in unexpected tax location/reporting outcomes.",
      optional: true,
    },
    taxValidateLocation: {
      type: "string",
      label: "Tax - Validate Location",
      description: "A flag that indicates when Stripe should validate the customer tax location. Defaults to deferred.",
      options: [
        "deferred",
        "immediately",
      ],
      optional: true,
    },
    balance: {
      type: "integer",
      label: "Balance",
      description: "An integer amount in cents that represents the customer's current balance, which affect the customer's future invoices. A negative amount represents a credit that decreases the amount due on an invoice; a positive amount increases the amount due on an invoice.",
      optional: true,
    },
    cashBalanceSettingsReconciliationMode: {
      type: "string",
      label: "Cash Balance Settings - Reconciliation Mode",
      description: "Controls how funds transferred by the customer are applied to payment intents and invoices. Valid options are automatic, manual, or merchant_default. For more information about these reconciliation modes, see Reconciliation.",
      options: [
        "automatic",
        "manual",
        "merchant_default",
      ],
      optional: true,
    },
    invoicePrefix: {
      type: "string",
      label: "Invoice Prefix",
      description: "The prefix for the customer used to generate unique invoice numbers. Must be 3–12 uppercase letters or numbers.",
      optional: true,
    },
    invoiceSettingsCustomFields: {
      type: "string[]",
      label: "Invoice Settings - Custom Fields",
      description: "The list of up to 4 default custom fields to be displayed on invoices for this customer. When updating, pass an empty string to remove previously-defined fields.",
      optional: true,
    },
    invoiceSettingsDefaultPaymentMethod: {
      type: "string",
      label: "Invoice Settings - Default Payment Method",
      description: "ID of a payment method that's attached to the customer, to be used as the customer's default payment method for subscriptions and invoices.",
      optional: true,
    },
    invoiceSettingsRenderingOptionsAmountTaxDisplay: {
      type: "string",
      label: "Invoice Settings - Rendering Options - Amount Tax Display",
      description: "How line-item prices and amounts will be displayed with respect to tax on invoice PDFs. One of exclude_tax or include_inclusive_tax. include_inclusive_tax will include inclusive tax (and exclude exclusive tax) in invoice PDF amounts. exclude_tax will exclude all tax (inclusive and exclusive alike) from invoice PDF amounts.",
      options: [
        "exclude_tax",
        "include_inclusive_tax",
      ],
      optional: true,
    },
    nextInvoiceSequence: {
      type: "integer",
      label: "Next Invoice Sequence",
      description: "The sequence to be used on the customer's next invoice. Defaults to 1.",
      optional: true,
      default: 1,
    },
    preferredLocales: {
      type: "string[]",
      label: "Preferred Locales",
      description: "Customer's preferred languages, ordered by preference.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "When using payment sources created via the Token or Sources APIs, passing source will create a new source object, make it the new customer default source, and delete the old customer default if one exists. If you want to add additional sources instead of replacing the existing default, use the card creation API. Whenever you attach a card to a customer, Stripe will automatically validate the card.",
      optional: true,
    },
    taxExempt: {
      type: "string",
      label: "Tax Exempt",
      description: "The customer's tax exemption. One of none, exempt, or reverse.",
      options: [
        "none",
        "exempt",
        "reverse",
      ],
      optional: true,
    },
    taxIdData: {
      type: "string[]",
      label: "Tax ID Data",
      description: "The customer's tax IDs. [See the documentation](https://docs.stripe.com/api/customers/create#create_customer-tax_id_data).",
      optional: true,
    },
    testClock: {
      type: "string",
      label: "Test Clock",
      description: "ID of the test clock to attach to the customer.",
      optional: true,
    },
  },
  methods: {
    getOtherParams() {
      const {
        addressCity,
        addressCountry,
        addressLine1,
        addressLine2,
        addressPostalCode,
        addressState,
        shippingAddressCity,
        shippingAddressCountry,
        shippingAddressLine1,
        shippingAddressLine2,
        shippingAddressPostalCode,
        shippingAddressState,
        shippingName,
        shippingPhone,
        taxIpAddress,
        taxValidateLocation,
        cashBalanceSettingsReconciliationMode,
        invoiceSettingsCustomFields,
        invoiceSettingsDefaultPaymentMethod,
        invoiceSettingsRenderingOptionsAmountTaxDisplay,
      } = this;

      const hasAddressData = addressCity
        || addressCountry
        || addressLine1
        || addressLine2
        || addressPostalCode
        || addressState;

      const hasShippingData = shippingAddressCity
        || shippingAddressCountry
        || shippingAddressLine1
        || shippingAddressLine2
        || shippingAddressPostalCode
        || shippingAddressState
        || shippingName
        || shippingPhone;

      const hasTaxData = taxIpAddress || taxValidateLocation;

      const hasInvoiceSettings = invoiceSettingsCustomFields
        || invoiceSettingsDefaultPaymentMethod
        || invoiceSettingsRenderingOptionsAmountTaxDisplay;

      return {
        ...(hasAddressData && {
          address: {
            city: addressCity,
            country: addressCountry,
            line1: addressLine1,
            line2: addressLine2,
            postal_code: addressPostalCode,
            state: addressState,
          },
        }),
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
            phone: shippingPhone,
          },
        }),
        ...(hasTaxData && {
          tax: {
            ip_address: taxIpAddress,
            validate_location: taxValidateLocation,
          },
        }),
        ...(cashBalanceSettingsReconciliationMode && {
          cash_balance: {
            settings: {
              reconciliation_mode: cashBalanceSettingsReconciliationMode,
            },
          },
        }),
        ...(hasInvoiceSettings && {
          invoice_settings: {
            custom_fields: invoiceSettingsCustomFields,
            default_payment_method: invoiceSettingsDefaultPaymentMethod,
            rendering_options: {
              amount_tax_display: invoiceSettingsRenderingOptionsAmountTaxDisplay,
            },
          },
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      name,
      description,
      email,
      metadata,
      paymentMethod,
      phone,
      balance,
      invoicePrefix,
      nextInvoiceSequence,
      preferredLocales,
      source,
      taxExempt,
      taxIdData,
      testClock,
      getOtherParams,
    } = this;

    const resp = await app.sdk().customers.create({
      name,
      description,
      email,
      metadata,
      payment_method: paymentMethod,
      phone,
      balance,
      invoice_prefix: invoicePrefix,
      next_invoice_sequence: nextInvoiceSequence,
      preferred_locales: preferredLocales,
      source,
      tax_exempt: taxExempt,
      tax_id_data: utils.parseArray(taxIdData),
      test_clock: testClock,
      ...getOtherParams(),
    });
    $.export("$summary", `Successfully created a new customer with ID \`${resp.id}\``);
    return resp;
  },
};
