import { parseObject } from "../../common/utils.mjs";
import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-create-billing-subscription",
  name: "Create Billing Subscription",
  description: "Creates a billing subscription for a customer. [See the documentation](https://pennylane.readme.io/reference/billing_subscriptions-post-1).",
  version: "0.0.1",
  type: "action",
  props: {
    pennylane,
    mode: {
      type: "string",
      label: "Mode",
      description: "Mode",
      optional: true,
    },
    paymentConditions: {
      type: "string",
      label: "Payment Conditions",
      description: "PaymentConditions",
      optional: true,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "PaymentMethod",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type",
      optional: true,
    },
    dayOfMonth: {
      type: "string",
      label: "Day Of Month",
      description: "DayOfMonth",
      optional: true,
    },
    dayOfWeek: {
      type: "string",
      label: "Day Of Week",
      description: "DayOfWeek",
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Interval",
      optional: true,
    },
    count: {
      type: "string",
      label: "Count",
      description: "Count",
      optional: true,
    },
    sourceId: {
      type: "string",
      label: "Source Id",
      description: "SourceId",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start",
      optional: true,
    },
    specialMention: {
      type: "string",
      label: "Special Mention",
      description: "Special Mention",
      optional: true,
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "Discount",
      optional: true,
    },
    lineItemsSectionsAttributes: {
      type: "string",
      label: "Line Items Sections Attributes",
      description: "Line Items Sections Attributes",
      optional: true,
    },
    invoiceLines: {
      type: "string",
      label: "Invoice Lines",
      description: "Invoice Lines",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pennylane.createBillingSubscription({
      $,
      data: {
        create_customer: false,
        create_products: false,
        billing_subscription: {
          currency: this.currency,
          mode: this.mode,
          start: this.start,
          payment_conditions: this.paymentConditions,
          payment_method: this.paymentMethod,
          recurring_rule: {
            type: this.type,
            day_of_month: this.dayOfMonth,
            day_of_week: this.dayOfWeek,
            interval: this.interval,
            count: this.count,
          },
          special_mention: this.specialMention,
          discount: this.discount,
          customer: {
            source_id: this.sourceId,
          },
          line_items_sections_attributes: parseObject(this.lineItemsSectionsAttributes),
          invoice_lines: parseObject(this.invoiceLines),
        },
      },
    });
    $.export("$summary", `Created billing subscription with ID ${response.billing_subscription.id}`);
    return response;
  },
};
