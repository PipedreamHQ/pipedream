import {
  DAY_OF_WEEK_OPTIONS,
  MODE_OPTIONS,
  PAYMENT_CONDITIONS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  RECURRING_RULE_TYPE,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-create-billing-subscription",
  name: "Create Billing Subscription",
  description: "Creates a billing subscription for a customer. [See the documentation](https://pennylane.readme.io/reference/billing_subscriptions-post-1).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pennylane,
    currency: {
      type: "string",
      label: "Currency",
      description: "Invoice Currency (ISO 4217). Default is EUR.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Mode in which the new invoices will be created.",
      options: MODE_OPTIONS,
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date (ISO 8601)",
    },
    paymentConditions: {
      type: "string",
      label: "Payment Conditions",
      description: "Customer payment conditions",
      options: PAYMENT_CONDITIONS_OPTIONS,
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "PaymentMethod",
      options: PAYMENT_METHOD_OPTIONS,
    },
    recurringRuleType: {
      type: "string",
      label: "Recurring Rule Type",
      description: "Type of the billing subscription's recurrence",
      options: RECURRING_RULE_TYPE,
      reloadProps: true,
    },
    dayOfMonth: {
      type: "integer",
      label: "Day Of Month",
      description: "The day of occurrences of the recurring rule",
      hidden: true,
    },
    dayOfWeek: {
      type: "string",
      label: "Day Of Week",
      description: "The day of occurrences of the recurring rule",
      options: DAY_OF_WEEK_OPTIONS,
      hidden: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "The interval of occurrences of the recurring rule",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of occurrences of the recurring rule",
      optional: true,
    },
    specialMention: {
      type: "string",
      label: "Special Mention",
      description: "Additional details",
      optional: true,
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "Invoice discount (in percent)",
      optional: true,
    },
    customerId: {
      propDefinition: [
        pennylane,
        "customerId",
      ],
    },
    lineItemsSectionsAttributes: {
      propDefinition: [
        pennylane,
        "lineItemsSectionsAttributes",
      ],
      optional: true,
    },
    invoiceLines: {
      propDefinition: [
        pennylane,
        "lineItems",
      ],
      label: "Invoice Lines",
    },
  },
  async additionalProps(props) {
    switch (this.recurringRuleType) {
    case "monthly":
      props.dayOfMonth.hidden = false;
      props.dayOfWeek.hidden = true;
      break;
    case "weekly":
      props.dayOfMonth.hidden = true;
      props.dayOfWeek.hidden = false;
      break;
    case "yearly":
      props.dayOfMonth.hidden = true;
      props.dayOfWeek.hidden = true;
      break;
    }
    return {};
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
            type: this.recurringRuleType,
            day_of_month: this.dayOfMonth,
            day_of_week: this.dayOfWeek,
            interval: this.interval,
            count: this.count,
          },
          special_mention: this.specialMention,
          discount: this.discount,
          customer: {
            source_id: this.customerId,
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
