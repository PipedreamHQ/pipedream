import Stripe from "stripe";
import constants from "./common/constants.mjs";

const createOptionsMethod = (collectionOrFn, keysOrFn) => async function ({
  prevContext, ...opts
}) {
  let { startingAfter } = prevContext;
  let result;
  if (typeof collectionOrFn === "function") {
    result = await collectionOrFn.call(this, {
      prevContext,
      ...opts,
    });
  } else {
    result = await this.sdk()[collectionOrFn].list({
      starting_after: startingAfter,
      limit: 50,
    });
  }

  let options;
  if (typeof keysOrFn === "function") {
    options = result.data.map(keysOrFn.bind(this));
  } else {
    options = result.data.map((obj) => ({
      value: obj[keysOrFn[0]],
      label: obj[keysOrFn[1]],
    }));
  }

  startingAfter = options?.[options.length - 1]?.value;

  return {
    options,
    context: {
      startingAfter,
    },
  };
};

export default {
  type: "app",
  app: "stripe",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Result Limit",
      description: "Maximum number of results",
      default: 100,
      min: 1,
      max: 10000,
    },
    customer: {
      type: "string",
      label: "Customer ID",
      description: "Example: `cus_Jz4ErxGo9t1agg`",
      options: createOptionsMethod("customers", function ({
        id, name, email,
      }) {
        return {
          value: id,
          label: [
            name,
            email,
            id,
          ].filter((v) => v).join(" | "),
        };
      }),
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Example: `pm_card_visa`",
      options: createOptionsMethod(
        function ({
          prevContext: { startingAfter }, customer, type,
        }) {
          // payment `type` is a required param
          if (!customer || !type) {
            return {
              data: [],
            };
          }
          return this.sdk().paymentMethods.list({
            starting_after: startingAfter,
            customer,
            type,
          });
        },
        function ({
          id, card, type,
        }) {
          const label = [
            type,
          ];
          if (type === "card") {
            label.push(card.brand, card.last4);
          }
          label.push(id);
          return {
            value: id,
            label: label.join(" "),
          };
        },
      ),
      optional: true,
    },
    price: {
      type: "string",
      label: "Price ID",
      description: "Example: `price_0HuVAoGHO3mdGsgAi0l1fEtm`",
      options: createOptionsMethod(
        function ({
          prevContext: { startingAfter }, type,
        }) {
          const params = {
            starting_after: startingAfter,
          };
          if (type) {
            params.type = type;
          }
          return this.sdk().prices.list(params);
        },
        [
          "id",
          "nickname",
        ],
      ),
      optional: true,
    },
    invoice: {
      type: "string",
      label: "Invoice ID",
      description: "Example: `in_0JMBoWGHO3mdGsgA6zwttRva`",
      options: createOptionsMethod(
        function ({
          prevContext: { startingAfter }, customer, subscription,
        }) {
          const params = {
            starting_after: startingAfter,
          };
          if (customer) {
            params.customer = customer;
          }
          if (subscription) {
            params.subscription = subscription;
          }
          return this.sdk().invoices.list(params);
        },
        [
          "id",
          "number",
        ],
      ),
      optional: true,
    },
    invoiceItem: {
      type: "string",
      label: "Invoice Item ID",
      description: "Example: `ii_0JMBoYGHO3mdGsgAgSUuIOan`",
      options: createOptionsMethod(
        function ({
          prevContext: { startingAfter }, invoice,
        }) {
          const params = {
            starting_after: startingAfter,
          };
          if (invoice) {
            params.invoice = invoice;
          }
          return this.sdk().invoiceItems.list(params);
        },
        [
          "id",
          "description",
        ],
      ),
      optional: true,
    },
    subscription: {
      type: "string",
      label: "Subscription ID",
      description: "Example: `sub_K0CC9GlXAWpBQg`",
      options: createOptionsMethod(
        function ({
          prevContext: { startingAfter }, customer, price,
        }) {
          const params = {
            starting_after: startingAfter,
          };
          if (customer) {
            params.customer = customer;
          }
          if (price) {
            params.price = price;
          }
          return this.sdk().subscriptions.list(params);
        },
        [
          "id",
          "id",
        ],
      ),
      optional: true,
    },
    checkoutSession: {
      type: "string",
      label: "Checkout Session ID",
      description: "Example: `cs_test_9eWaeld2XfS9lsUjtzPQxPH0GcG30XfkDCAf3WgQ4OhmvdA7dwGcmZYR`",
      optional: true,
    },
    paymentIntent: {
      type: "string",
      label: "Payment Intent ID",
      description: "Example: `pi_0FhyHzGHO3mdGsgAJNHu7VeJ`",
      options: createOptionsMethod("paymentIntents", [
        "id",
        "description",
      ]),
      optional: true,
    },
    charge: {
      type: "string",
      label: "Charge ID",
      description: "Example: `ch_0IwGKaGHO3mdGsgAMweyhl0E`",
      options: createOptionsMethod("charges", [
        "id",
        "description",
      ]),
      optional: true,
    },
    refund: {
      type: "string",
      label: "Refund ID",
      description: "Example: `re_0JL8pIGHO3mdGsgAsFJAlTnn`",
      options: createOptionsMethod("refunds", [
        "id",
        "id",
      ]),
      optional: true,
    },
    payout: {
      type: "string",
      label: "Payout ID",
      description: "Example: `po_0JL8pIGHO3mdGsgAthGqEt0m`",
      options: createOptionsMethod("payouts", [
        "id",
        "description",
      ]),
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter ISO country code",
      options: createOptionsMethod("countrySpecs", function ({ id }) {
        return {
          value: id,
          label: id,
        };
      }),
      default: "US",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Three-letter ISO currency code, in lowercase; must be a [supported currency](https://stripe.com/docs/currencies)",
      options: createOptionsMethod(
        async function ({ country }) {
          if (!country) {
            return {
              data: [],
            };
          }
          const spec = await this.sdk().countrySpecs.retrieve(country);
          return {
            data: spec.supported_payment_currencies,
          };
        },
        function (code) {
          return {
            value: code,
            label: code,
          };
        },
      ),
      default: "usd",
      optional: true,
    },
    paymentIntentClientSecret: {
      type: "string",
      label: "Client Secret",
      description: "Example: `pi_0FhyHzGHO3mdGsgAJNHu7VeJ`",
      secret: true,
      optional: true,
    },
    paymentIntentCancellationReason: {
      type: "string",
      label: "Cancellation Reason",
      description: "Indicate why the payment was cancelled",
      options: [
        "duplicate",
        "fraudulent",
        "requested_by_customer",
        "abandoned",
      ],
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Amount. Use the smallest currency unit (e.g., 100 cents to charge $1.00 or 100 to charge ¥100, a zero-decimal currency). The minimum amount is $0.50 US or equivalent in charge currency. The amount value supports up to eight digits (e.g., a value of 99999999 for a USD charge of $999,999.99).",
      optional: true,
    },
    paymentMethodTypes: {
      type: "string[]",
      label: "Payment Method Types",
      description: "Payment method types that may be used",
      options: [
        "acss_debit",
        "alipay",
        "au_becs_debit",
        "bancontact",
        "card",
        "card_present",
        "eps",
        "giropay",
        "ideal",
        "interac_present",
        "p24",
        "sepa_debit",
        "sofort",
      ],
      optional: true,
    },
    statementDescriptor: {
      type: "string",
      label: "Statement Descriptor",
      description: "Text that appears on the customer's statement as the statement descriptor for a non-card charge. This value overrides the account's default statement descriptor. For information about requirements, including the 22-character limit, see the Statement Descriptor docs.",
      optional: true,
    },
    statementDescriptorSuffix: {
      type: "string",
      label: "Statement Descriptor Suffix",
      description: "Provides information about a card charge. Concatenated to the account's [statement descriptor prefix](https://docs.stripe.com/get-started/account/statement-descriptors#static) to form the complete statement descriptor that appears on the customer's statement.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Set of [key-value pairs](https://docs.stripe.com/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to metadata.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The resouce name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer's email address. It's displayed alongside the customer in your dashboard and can be useful for searching and tracking. This may be up to 512 characters.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The customer's phone number. This field is required when creating a new customer. If you do not provide a phone number, the customer will be created with the phone number of the connected account.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "An arbitrary string that you can attach to a the object eg. customer, invoice, etc.",
      optional: true,
    },
    setupFutureUsage: {
      type: "string",
      label: "Setup Future Usage",
      description: "Indicate if you intend to use the specified payment method for a future payment. If you intend to only reuse the payment method when your customer is present in your checkout flow, choose `on_session`; otherwise, choose `off_session`.",
      options: [
        "on_session",
        "off_session",
      ],
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Non-negative integer. The quantity of units for the invoice item.",
      optional: true,
    },
    autoAdvance: {
      type: "boolean",
      label: "Auto Advance",
      description: "Controls whether Stripe performs [automatic collection](https://docs.stripe.com/invoicing/integration/automatic-advancement-collection) of the invoice. If false, the invoice's state doesn't automatically advance without an explicit action.",
      optional: true,
      default: false,
    },
    collectionMethod: {
      type: "string",
      label: "Collection Method",
      description: "Either `charge_automatically`, or `send_invoice`. When charging automatically, Stripe will attempt to pay this invoice using the default source attached to the customer. When sending an invoice, Stripe will email this invoice to the customer with payment instructions. Defaults to charge_automatically.",
      options: [
        "charge_automatically",
        "send_invoice",
      ],
      optional: true,
    },
    daysUntilDue: {
      type: "integer",
      label: "Days Until Due",
      description: "The number of days from when the invoice is created until it is due.",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the product is currently available for purchase. Defaults to `true`",
      optional: true,
    },
    recurringInterval: {
      type: "string",
      label: "Price Recurring Interval",
      description: "Specifies the billing cycle for the price",
      options: [
        "day",
        "week",
        "month",
        "year",
      ],
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options({ prevContext: { startingAfter } }) {
        if (startingAfter === false) {
          return [];
        }
        const { data: products } = await this.getProducts({
          starting_after: startingAfter,
        });

        const [
          lastProduct,
        ] = products;
        const lastProductId = lastProduct?.id;

        const options =
          products.map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          }));

        return {
          options,
          context: {
            startingAfter: lastProductId || false,
          },
        };
      },
    },
    unitAmount: {
      type: "integer",
      label: "Unit Amount",
      description: "A positive integer in cents (or `0` for a free price) representing how much to charge. One of **Unit Amount** or **Custom Unit Amount** is required, unless **Billing Scheme** is `tiered`.",
      optional: true,
    },
    unitAmountDecimal: {
      type: "string",
      label: "Unit Amount Decimal",
      description: "Same as **Unit Amount**, but accepts a decimal value in cents with at most 12 decimal places. Only one of **Unit Amount** and **Unit Amount Decimal** can be set.",
      optional: true,
    },
    createdGt: {
      type: "string",
      label: "Created (Greater Than)",
      description: "Only return transactions that were created after this date (exclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    createdGte: {
      type: "string",
      label: "Created (Greater Than Or Equal To)",
      description: "Only return transactions that were created after this date (inclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    createdLt: {
      type: "string",
      label: "Created (Less Than)",
      description: "Only return transactions that were created before this date (exclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    createdLte: {
      type: "string",
      label: "Created (Less Than Or Equal To)",
      description: "Only return transactions that were created before this date (inclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    arrivalDateGt: {
      type: "string",
      label: "Arrival Date (Greater Than)",
      description: "Only return transactions that were created after this date (exclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    arrivalDateGte: {
      type: "string",
      label: "Arrival Date (Greater Than Or Equal To)",
      description: "Only return transactions that were created after this date (inclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    arrivalDateLt: {
      type: "string",
      label: "Arrival Date (Less Than)",
      description: "Only return transactions that were created before this date (exclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    arrivalDateLte: {
      type: "string",
      label: "Arrival Date (Less Than Or Equal To)",
      description: "Only return transactions that were created before this date (inclusive). In ISO 8601 format. Eg. `2023-01-01T00:00:00Z`",
      optional: true,
    },
    endingBefore: {
      type: "string",
      label: "Ending Before",
      description: "A cursor for use in pagination. **Ending Before** is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with `obj_bar`, your subsequent call can include `ending_before=obj_bar` in order to fetch the previous page of the list.",
      optional: true,
    },
    startingAfter: {
      type: "string",
      label: "Starting After",
      description: "A cursor for use in pagination. **Starting After** is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include `starting_after=obj_foo` in order to fetch the next page of the list.",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "Address - City",
      description: "City, district, suburb, town, or village.",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Address - Country",
      description: "Two-letter country code (ISO 3166-1 alpha-2).",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address - Line 1",
      description: "Address line 1 (e.g., street, PO Box, or company name).",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Shipping - Address - Line 2",
      description: "Address line 2 (e.g., apartment, suite, unit, or building).",
      optional: true,
    },
    addressPostalCode: {
      type: "string",
      label: "Address - Postal Code",
      description: "ZIP or postal code.",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "Shipping - Address - State",
      description: "State, county, province, or region.",
      optional: true,
    },
    shippingName: {
      type: "string",
      label: "Shipping - Name",
      description: "Recipient name.",
      optional: true,
    },
    shippingCarrier: {
      type: "string",
      label: "Shipping - Carrier",
      description: "The delivery service that shipped a physical product, such as Fedex, UPS, USPS, etc.",
      optional: true,
    },
    shippingPhone: {
      type: "string",
      label: "Shipping - Phone",
      description: "Recipient phone (including extension).",
      optional: true,
    },
    shippingTrackingNumber: {
      type: "string",
      label: "Shipping - Tracking Number",
      description: "The tracking number for a physical product, obtained from the delivery service. If multiple tracking numbers were generated for this purchase, please separate them with commas.",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    sdk(apiVersion = constants.API_VERSION) {
      return new Stripe(this._apiKey(), {
        apiVersion,
        maxNetworkRetries: 2,
      });
    },
    async getEvents({ eventType }) {
      const response = await this.sdk().events.list({
        limit: 25,
        type: eventType,
      });

      return response.data;
    },
    getProducts(args = {}) {
      return this.sdk().products.list(args);
    },
  },
};
