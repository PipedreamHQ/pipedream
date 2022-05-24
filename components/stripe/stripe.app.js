/* eslint-disable pipedream/default-value-required-for-optional-props */

const stripe = require("stripe");

/**
 * Options used to generate options for a prop
 *
 * @see {@link https://pipedream.com/docs/components/api/#async-options-example Components API docs}
 *
 * @typedef {Object} OptionsMethodOptions
 * @property {Object} [opts.prevContext] - An object representing the context for the previous
 * `options` invocation
 * @property {...*} [opts.values] - Additional values used to generate options
 */

/**
 * Typically returns an array of values matching the prop type (e.g., `string`) or an array of
 * object that define the `label` and `value` for each option
 *
 * * @see {@link https://pipedream.com/docs/components/api/#async-options-example Components API docs}
 *
 * @callback optionsMethod
 * @param {OptionsMethodOptions} opts - Options used to generate options for a prop
 * @returns {{ options: String[], context: Object }} An object with an `options` array and a context
 * object with a `nextPageToken` key
 */

/**
 * Returns a Stripe collection object
 * @callback collectionFn
 *
 * @see {@link https://stripe.com/docs/api/pagination Stripe Pagination Docs}
 *
 * @param {OptionsMethodOptions} opts - Options used to call a Stripe collection function
 * @returns {{ data: Array }} A object with a data property that contains an array of items
 */

/**
 * Returns a prop option string or object
 * @callback keyFn
 *
 * @param {Object} object - An item object used to create a prop option
 * @returns {(String|{label:String,value:String})} A prop option string or object
 */

/**
 * Creates an async options method to be used as the `options` property of a component prop
 *
 * @param {(String|collectionFn)} collectionOrFn - A stripe collection name or function that returns
 * a Stripe collection object
 * @param {([valueKey:String,labelKey:String]|keyFn)} keysOrFn - An array pair whose values define a
 * mapping from Stripe item to prop option, or a function that returns a prop option
 * @returns {optionsMethod} The created options method
 */
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

module.exports = {
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
    payment_method: {
      type: "string",
      label: "Payment Method",
      description: "Example: `pm_card_visa`",
      options: createOptionsMethod(
        function({
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
            customer: customer,
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
        function({
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
        function({
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
    invoice_item: {
      type: "string",
      label: "Invoice Item ID",
      description: "Example: `ii_0JMBoYGHO3mdGsgAgSUuIOan`",
      options: createOptionsMethod(
        function({
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
        function({
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
    subscription_item: {
      type: "string",
      label: "Subscription Item ID",
      description: "Example: `si_K0CCMs2vNHPxV2`",
      options: createOptionsMethod(
        function({
          prevContext: { startingAfter }, subscription,
        }) {
          if (!subscription) {
            return [];
          }
          return this.sdk().subscriptionItems.list({
            starting_after: startingAfter,
            subscription: subscription,
          });
        },
        [
          "id",
          "id",
        ],
      ),
      optional: true,
    },
    checkout_session: {
      type: "string",
      label: "Checkout Session ID",
      description: "Example: `cs_test_9eWaeld2XfS9lsUjtzPQxPH0GcG30XfkDCAf3WgQ4OhmvdA7dwGcmZYR`",
      optional: true,
    },
    payment_intent: {
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
      description: "Three-letter ISO currency code, in lowercase; must be a [supported currency]" +
        "(https://stripe.com/docs/currencies)",
      options: createOptionsMethod(
        async function({ country }) {
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
    payment_intent_client_secret: {
      type: "string",
      label: "Client Secret",
      description: "Example: `pi_0FhyHzGHO3mdGsgAJNHu7VeJ`",
      secret: true,
      optional: true,
    },
    payment_intent_cancellation_reason: {
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
      description: "Amount. Use the smallest currency unit (e.g., 100 cents to " +
        "charge $1.00 or 100 to charge ¥100, a zero-decimal currency). The minimum amount is " +
        "$0.50 US or equivalent in charge currency. The amount value supports up to eight digits " +
        "(e.g., a value of 99999999 for a USD charge of $999,999.99).",
      optional: true,
    },
    payment_method_types: {
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
    statement_descriptor: {
      type: "string",
      label: "Statement Descriptor",
      description: "For non-card charges, you can use this value as the complete description " +
        "that appears on your customers' statements. Must contain at least one letter, " +
        "maximum 22 characters.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Associate other information that's meaningful to you with Stripe activity. " +
        "Metadata will not be shown to customers or affect whether or not a payment is accepted.",
      optional: true,
    },
    advanced: {
      type: "object",
      label: "Advanced Options",
      description: "Add any additional parameters that you require here",
      optional: true,
    },
    /* eslint-disable pipedream/props-description */
    name: {
      type: "string",
      label: "Name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      optional: true,
    },
    /* eslint-enable pipedream/props-description */
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "Street, PO Box, or company name",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Apartment, suite, unit, or building",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City, district, suburb, town, or village",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State, county, province, or region",
      optional: true,
    },
    postal_code: {
      type: "string",
      label: "Postal Code",
      description: "ZIP or postal code",
      optional: true,
    },
    setup_future_usage: {
      type: "string",
      label: "Setup Future Usage",
      description: "Indicate if you intend to use the specified payment method for a future " +
        "payment. If you intend to only reuse the payment method when your customer is present " +
        "in your checkout flow, choose `on_session`; otherwise, choose `off_session`.",
      options: [
        "on_session",
        "off_session",
      ],
      optional: true,
    },
    refund_reason: {
      type: "string",
      label: "Reason",
      description: "If you believe the charge to be fraudulent, specifying fraudulent as the " +
        "reason will add the associated card and email to your block lists, and will also help " +
        "Stripe improve its fraud detection algorithms.",
      options: [
        "duplicate",
        "fraudulent",
        "requested_by_customer",
      ],
      optional: true,
    },
    refund_application_fee: {
      type: "boolean",
      label: "Refund Application Fee",
      description: "Whether the application fee should be refunded when refunding this charge. " +
        "If a full charge refund is given, the full application fee will be refunded. Otherwise, " +
        "the application fee will be refunded in an amount proportional to the amount of the " +
        "charge refunded. Note that an application fee can be refunded only by the application " +
        "that created the charge.",
      optional: true,
    },
    reverse_transfer: {
      type: "boolean",
      label: "Refund Application Fee",
      description: "Whether the transfer should be reversed when refunding this charge. The " +
        "transfer will be reversed proportionally to the amount being refunded (either the " +
        "entire or partial amount). Note that a transfer can be reversed only by the application " +
        "that created the charge.",
      optional: true,
    },
    /* eslint-disable pipedream/props-description */
    payout_status: {
      type: "string",
      label: "Payout Status",
      options: [
        "pending",
        "paid",
        "failed",
        "canceled",
      ],
      optional: true,
    },
    /* eslint-enable pipedream/props-description */
    payout_method: {
      type: "string",
      label: "Payout Method",
      description: "`instant` is only supported for payouts to debit cards",
      default: "standard",
      options: [
        "standard",
        "instant",
      ],
      optional: true,
    },
    payout_source_type: {
      type: "string",
      label: "Payout Source Type",
      description: "The balance type of your Stripe balance to draw this payout from",
      options: [
        "bank_account",
        "card",
        "fpx",
      ],
      optional: true,
    },
    /* eslint-disable pipedream/props-description */
    balance_transaction_type: {
      type: "string",
      label: "Transaction Type",
      options: [
        "adjustment",
        "advance",
        "advance_funding",
        "anticipation_repayment",
        "application_fee",
        "application_fee_refund",
        "charge",
        "connect_collection_transfer",
        "contribution",
        "issuing_authorization_hold",
        "issuing_authorization_release",
        "issuing_dispute",
        "issuing_transaction",
        "payment",
        "payment_failure_refund",
        "payment_refund",
        "payout",
        "payout_cancel",
        "payout_failure",
        "refund",
        "refund_failure",
        "reserve_transaction",
        "reserved_funds",
        "stripe_fee",
        "stripe_fx_fee",
        "tax_fee",
        "topup",
        "topup_reversal",
        "transfer",
        "transfer_cancel",
        "transfer_failure",
        "transfer_refund",
      ],
      optional: true,
    },
    timestamp: {
      type: "integer",
      label: "Timestamp",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      optional: true,
    },
    /* eslint-enable pipedream/props-description */
    usage_record_action: {
      type: "string",
      label: "Action",
      description: "Add the quantity to the usage at the specified timestamp, or overwrite the " +
        "usage quantity at that timestamp. If the subscription has billing thresholds, increment " +
        "is the only allowed value.",
      options: [
        "increment",
        "set",
      ],
      default: "increment",
      optional: true,
    },
    /* eslint-disable pipedream/props-description */
    invoice_status: {
      type: "string",
      label: "Status",
      options: [
        "draft",
        "open",
        "paid",
        "uncollectible",
        "void",
      ],
      optional: true,
    },
    /* eslint-enable pipedream/props-description */
    invoice_auto_advance: {
      type: "boolean",
      label: "Auto Collect",
      description: "Attempt to automatically collect the invoice. When disabled, the invoice's " +
        "state will not automatically advance without an explicit action.",
      optional: true,
      default: false,
    },
    /* eslint-disable pipedream/props-description */
    invoice_collection_method: {
      type: "string",
      label: "Collection Method",
      options: [
        "charge_automatically",
        "send_invoice",
      ],
      optional: true,
    },
    /* eslint-enable pipedream/props-description */
    invoice_days_until_due: {
      type: "integer",
      label: "Payment Terms",
      description: "The number of days until the invoice is due (valid when collection method is " +
        "`send_invoice`)",
      optional: true,
    },
  },
  methods: {
    sdk() {
      return stripe(this.$auth.api_key, {
        apiVersion: "2020-03-02",
        maxNetworkRetries: 2,
      });
    },
    // https://github.com/stripe/stripe-node/blob/master/types/2020-03-02/WebhookEndpoints.d.ts#L225
    enabledEvents() {
      return [
        "*",
        "account.application.authorized",
        "account.application.deauthorized",
        "account.external_account.created",
        "account.external_account.deleted",
        "account.external_account.updated",
        "account.updated",
        "application_fee.created",
        "application_fee.refund.updated",
        "application_fee.refunded",
        "balance.available",
        "capability.updated",
        "charge.captured",
        "charge.dispute.closed",
        "charge.dispute.created",
        "charge.dispute.funds_reinstated",
        "charge.dispute.funds_withdrawn",
        "charge.dispute.updated",
        "charge.expired",
        "charge.failed",
        "charge.pending",
        "charge.refund.updated",
        "charge.refunded",
        "charge.succeeded",
        "charge.updated",
        "checkout.session.async_payment_failed",
        "checkout.session.async_payment_succeeded",
        "checkout.session.completed",
        "coupon.created",
        "coupon.deleted",
        "coupon.updated",
        "credit_note.created",
        "credit_note.updated",
        "credit_note.voided",
        "customer.created",
        "customer.deleted",
        "customer.discount.created",
        "customer.discount.deleted",
        "customer.discount.updated",
        "customer.source.created",
        "customer.source.deleted",
        "customer.source.expiring",
        "customer.source.updated",
        "customer.subscription.created",
        "customer.subscription.deleted",
        "customer.subscription.pending_update_applied",
        "customer.subscription.pending_update_expired",
        "customer.subscription.trial_will_end",
        "customer.subscription.updated",
        "customer.tax_id.created",
        "customer.tax_id.deleted",
        "customer.tax_id.updated",
        "customer.updated",
        "file.created",
        "invoice.created",
        "invoice.deleted",
        "invoice.finalized",
        "invoice.marked_uncollectible",
        "invoice.paid",
        "invoice.payment_action_required",
        "invoice.payment_failed",
        "invoice.payment_succeeded",
        "invoice.sent",
        "invoice.upcoming",
        "invoice.updated",
        "invoice.voided",
        "invoiceitem.created",
        "invoiceitem.deleted",
        "invoiceitem.updated",
        "issuing_authorization.created",
        "issuing_authorization.request",
        "issuing_authorization.updated",
        "issuing_card.created",
        "issuing_card.updated",
        "issuing_cardholder.created",
        "issuing_cardholder.updated",
        "issuing_dispute.created",
        "issuing_dispute.funds_reinstated",
        "issuing_dispute.updated",
        "issuing_transaction.created",
        "issuing_transaction.updated",
        "mandate.updated",
        "order.created",
        "order.payment_failed",
        "order.payment_succeeded",
        "order.updated",
        "order_return.created",
        "payment_intent.amount_capturable_updated",
        "payment_intent.canceled",
        "payment_intent.created",
        "payment_intent.payment_failed",
        "payment_intent.processing",
        "payment_intent.succeeded",
        "payment_method.attached",
        "payment_method.card_automatically_updated",
        "payment_method.detached",
        "payment_method.updated",
        "payout.canceled",
        "payout.created",
        "payout.failed",
        "payout.paid",
        "payout.updated",
        "person.created",
        "person.deleted",
        "person.updated",
        "plan.created",
        "plan.deleted",
        "plan.updated",
        "price.created",
        "price.deleted",
        "price.updated",
        "product.created",
        "product.deleted",
        "product.updated",
        "radar.early_fraud_warning.created",
        "radar.early_fraud_warning.updated",
        "recipient.created",
        "recipient.deleted",
        "recipient.updated",
        "reporting.report_run.failed",
        "reporting.report_run.succeeded",
        "reporting.report_type.updated",
        "review.closed",
        "review.opened",
        "setup_intent.canceled",
        "setup_intent.created",
        "setup_intent.setup_failed",
        "setup_intent.succeeded",
        "sigma.scheduled_query_run.created",
        "sku.created",
        "sku.deleted",
        "sku.updated",
        "source.canceled",
        "source.chargeable",
        "source.failed",
        "source.mandate_notification",
        "source.refund_attributes_required",
        "source.transaction.created",
        "source.transaction.updated",
        "subscription_schedule.aborted",
        "subscription_schedule.canceled",
        "subscription_schedule.completed",
        "subscription_schedule.created",
        "subscription_schedule.expiring",
        "subscription_schedule.released",
        "subscription_schedule.updated",
        "tax_rate.created",
        "tax_rate.updated",
        "topup.canceled",
        "topup.created",
        "topup.failed",
        "topup.reversed",
        "topup.succeeded",
        "transfer.created",
        "transfer.failed",
        "transfer.paid",
        "transfer.reversed",
        "transfer.updated",
      ];
    },
  },
};
