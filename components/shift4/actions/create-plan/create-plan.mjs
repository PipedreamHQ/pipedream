import { parseObject } from "../../common/utils.mjs";
import shift4 from "../../shift4.app.mjs";

export default {
  key: "shift4-create-plan",
  name: "Create Plan",
  description: "Creates a new plan object. [See the documentation](https://dev.shift4.com/docs/api#plan-create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shift4,
    amount: {
      propDefinition: [
        shift4,
        "amount",
      ],
      description: "Subscription charge amount in minor units of a given currency. For example, 10€ is represented as \"1000\", and 10¥ is represented as \"10\".",
    },
    currency: {
      propDefinition: [
        shift4,
        "currency",
      ],
      description: "Subscription charge currency represented as a three-letter ISO currency code.",
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "The interval at which a plan is set to recur. Could be 'day', 'week', 'month', or 'year'.",
      options: [
        "day",
        "week",
        "month",
        "year",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the plan.",
    },
    intervalCount: {
      type: "integer",
      label: "Interval Count",
      description: "The number of intervals between each subscription billing. For example, if `interval`=`month` and `intervalCount`=`3`, subscriptions created with this plan will be billed every 3 months.",
      optional: true,
    },
    billingCycles: {
      type: "integer",
      label: "Billing Cycles",
      description: "The number of billing cycles for the payment period. If left blank, the subscription will continue indefinitely.",
      optional: true,
    },
    trialPeriodDays: {
      type: "integer",
      label: "Trial Period Days",
      description: "The number of trial period days granted when subscribing a customer to this plan.",
      optional: true,
    },
    recursTo: {
      propDefinition: [
        shift4,
        "recursTo",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        shift4,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      shift4,
      metadata,
      ...data
    } = this;

    const response = await shift4.createPlan({
      $,
      data: {
        ...data,
        metadata: metadata && parseObject(metadata),
      },
    });

    $.export("$summary", `Successfully created plan with Id: '${response.id}'`);
    return response;
  },
};
