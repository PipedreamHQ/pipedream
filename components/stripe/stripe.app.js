const stripe = require("stripe");

const createOptionsMethod = (collectionOrFn, keysOrFn) => async function ({ prevContext }) {
  let result;
  if (typeof collectionOrFn === "function") {
    result = await collectionOrFn.call(this, {
      prevContext,
    });
  } else {
    result = await this.stripe.sdk()[collectionOrFn].list({
      starting_after: prevContext,
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

  let nextPageToken = null;
  if (options[options.length - 1]) {
    nextPageToken = options[options.length - 1].value;
  }

  return {
    options,
    nextPageToken,
  };
};

module.exports = {
  type: "app",
  app: "stripe",
  propDefinitions: {
    customer: {
      type: "string",
      label: "Customer ID",
      description: "Example: `cus_Jz4ErxGo9t1agg`",
      options: createOptionsMethod("customers", [
        "id",
        "name",
      ]),
    },
    payment_method: {
      type: "string",
      label: "Payment Method",
      description: "Example: `pm_card_visa`",
      options: createOptionsMethod(
        function({ prevContext }) {
          if (!this.customer) {
            return {
              data: [],
            };
          }
          return this.stripe.sdk().paymentMethods.list({
            starting_after: prevContext,
            customer: this.customer,
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
    },
    payment_intent: {
      type: "string",
      label: "Payment Intent ID",
      description: "Example: `pi_0FhyHzGHO3mdGsgAJNHu7VeJ`",
      options: createOptionsMethod("paymentIntents", [
        "id",
        "description",
      ]),
    },
    charge: {
      type: "string",
      label: "Charge ID",
      description: "Example: `ch_0IwGKaGHO3mdGsgAMweyhl0E`",
      options: createOptionsMethod("charges", [
        "id",
        "description",
      ]),
    },
    refund: {
      type: "string",
      label: "Refund ID",
      description: "Example: `re_0JL8pIGHO3mdGsgAsFJAlTnn`",
      options: createOptionsMethod("refunds", [
        "id",
        "id",
      ]),
    },
    payout: {
      type: "string",
      label: "Payout ID",
      description: "Example: `po_0JL8pIGHO3mdGsgAthGqEt0m`",
      options: createOptionsMethod("payouts", [
        "id",
        "description",
      ]),
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter ISO country code, in lowercase.",
      options: createOptionsMethod("countrySpecs", function (id) {
        return {
          value: id,
          label: id,
        };
      }),
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Three-letter ISO currency code, in lowercase. Must be a [supported currency]" +
        "(https://stripe.com/docs/currencies).",
      options: createOptionsMethod(
        function() {
          if (!this.country) {
            return {
              data: [],
            };
          }
          const spec = this.stripe.sdk().countrySpecs.retrieve(this.country);
          return {
            data: spec.supported_payment_currencies,
          };
        },
        function (id) {
          return {
            value: id,
            label: id,
          };
        },
      ),
    },
    payment_intent_client_secret: {
      type: "string",
      label: "Client Secret",
      description: "Example: `pi_0FhyHzGHO3mdGsgAJNHu7VeJ`",
      required: true,
      secret: true,
    },
    payment_intent_cancellation_reason: {
      type: "string",
      name: "Cancellation Reason",
      options: [
        "duplicate",
        "fraudulent",
        "requested_by_customer",
        "abandoned",
      ],
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Amount. Use the smallest currency unit (e.g., 100 cents to " +
        "charge $1.00 or 100 to charge ¥100, a zero-decimal currency). The minimum amount is " +
        "$0.50 US or equivalent in charge currency. The amount value supports up to eight digits " +
        "(e.g., a value of 99999999 for a USD charge of $999,999.99).",
    },
    payment_method_types: {
      type: "string[]",
      label: "Payment Method Types",
      description: "Payment method types that may be used.",
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
    },
    statement_descriptor: {
      type: "string",
      label: "Statement Descriptor",
      description: "For non-card charges, you can use this value as the complete description " +
        "that appears on your customers' statements. Must contain at least one letter, " +
        "maximum 22 characters.",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "associate other information that’s meaningful to you with Stripe activity. " +
        "Metadata will not be shown to customers or affect whether or not a payment is accepted.",
    },
    advanced: {
      type: "object",
      label: "Advanced Options",
    },
    name: {
      type: "string",
      label: "Name",
    },
    email: {
      type: "string",
      label: "Email",
    },
    phone: {
      type: "string",
      label: "Phone",
    },
    description: {
      type: "string",
      label: "Description",
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "Street, PO Box, or company name.",
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Apartment, suite, unit, or building.",
    },
    city: {
      type: "string",
      label: "City",
      description: "City, district, suburb, town, or village.",
    },
    state: {
      type: "string",
      label: "State",
      description: "State, county, province, or region.",
    },
    postal_code: {
      type: "string",
      label: "Postal Code",
      description: "ZIP or postal code.",
    },
    setup_future_usage: {
      type: "boolean",
      label: "Setup Future Usage",
      description: "Indicate if you intend to use the specified payment method for a future " +
        "payment. If you intend to only reuse the payment method when your customer is present " +
        "in your checkout flow, choose `on_session`; otherwise, choose `off_session`.",
      options: [
        "on_session",
        "off_session",
      ],
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
    },
    refund_application_fee: {
      type: "boolean",
      label: "Refund Application Fee",
      description: "Whether the application fee should be refunded when refunding this charge. " +
        "If a full charge refund is given, the full application fee will be refunded. Otherwise, " +
        "the application fee will be refunded in an amount proportional to the amount of the " +
        "charge refunded. Note that an application fee can be refunded only by the application " +
        "that created the charge.",
    },
    reverse_transfer: {
      type: "boolean",
      label: "Refund Application Fee",
      description: "Whether the transfer should be reversed when refunding this charge. The " +
        "transfer will be reversed proportionally to the amount being refunded (either the " +
        "entire or partial amount). Note that a transfer can be reversed only by the application " +
        "that created the charge.",
    },
    payout_status: {
      type: "string",
      label: "Payout Status",
      description: ".",
      options: [
        "pending",
        "paid",
        "failed",
        "canceled",
      ],
    },
    payout_method: {
      type: "string",
      label: "Payout Method",
      description: "`instant` is only supported for payouts to debit cards.",
      default: "standard",
      options: [
        "standard",
        "instant",
      ],
    },
    payout_source_type: {
      type: "string",
      label: "Payout Source Type",
      description: "The balance type of your Stripe balance to draw this payout from.",
      options: [
        "bank_account",
        "card",
        "fpx",
      ],
    },
    balance_transaction_type: {
      type: "string",
      label: "Type",
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
      ]
    }
  },
  methods: {
    sdk() {
      return stripe(this.$auth.api_key, {
        apiVersion: "2020-03-02",
      });
    },
    async paginate(fn, limit = 100) {
      let hasMore = true;
      const params = {
        limit,
      };
      const items = [];
      while (hasMore) {
        const result = await fn(params);
        if (result.object !== "list") {
          throw new Error("Only 'list'-type queries can be paginated");
        }
        items.push(...result.data);
        hasMore = result.data.length > 0 && result.has_more;
        params.starting_after = result.data[result.data.length - 1].id;
      }
      return items;
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
