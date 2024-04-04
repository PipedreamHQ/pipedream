import shift4 from "../../shift4.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shift4-create-plan",
  name: "Create Plan",
  description: "Creates a new plan object. [See the documentation](https://dev.shift4.com/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    shift4,
    amount: {
      propDefinition: [
        shift4,
        "amount",
      ],
    },
    currency: {
      propDefinition: [
        shift4,
        "currency",
      ],
    },
    interval: {
      propDefinition: [
        shift4,
        "interval",
      ],
    },
    name: {
      propDefinition: [
        shift4,
        "name",
      ],
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
      type: "string",
      label: "Recurs To",
      description: "The plan to which this plan will recur after the billing cycles have completed.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A set of key-value pairs that you can attach to a plan object.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shift4.createPlan({
      amount: this.amount,
      currency: this.currency,
      interval: this.interval,
      name: this.name,
      intervalCount: this.intervalCount,
      billingCycles: this.billingCycles,
      trialPeriodDays: this.trialPeriodDays,
      recursTo: this.recursTo,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created plan '${this.name}'`);
    return response;
  },
};
