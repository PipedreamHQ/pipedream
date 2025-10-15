import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";
import { CreateSubscriptionParams } from "../../common/requestParams";
import { Subscription } from "../../common/responseSchemas";
import { EffectiveDateDescription } from "../../common/propDescriptions";

export default defineAction({
  name: "Create Subscription",
  description:
    "Create a subscription [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/manually-added-customers/creating-subscriptions/create-a-subscription)",
  key: "profitwell-create-subscription",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    profitwell,
    userId: {
      type: "string",
      label: "User ID",
      description:
        "Only use if you are referencing an existing user for whom you need to create an additional subscription.",
      optional: true,
    },
    userAlias: {
      type: "string",
      label: "User Alias",
      description:
        "For a new user, you can include your own identifier here. If creating a subscription for an existing user, this can be used instead of `User ID`.",
      optional: true,
    },
    subscriptionAlias: {
      type: "string",
      label: "Subscription Alias",
      description: `If included, you can use this to reference the subscription later, instead of its ID.
        \\
        Note that this alias must be **unique** across all users in your company, and cannot contain more than **36 characters**.`,
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description:
        "The email address of the user. This will be the display text that is used on the Customers tab.",
    },
    planId: {
      propDefinition: [
        profitwell,
        "planId",
      ],
    },
    planInterval: {
      propDefinition: [
        profitwell,
        "planInterval",
      ],
    },
    planCurrency: {
      type: "string",
      label: "Plan Currency",
      description:
        "The currency in which users of this plan are charged. [See the docs](https://profitwellapiv2.docs.apiary.io/#/reference/manually-added-customers/creating-subscriptions/create-a-subscription) for the full list of accepted currency codes.",
      optional: true,
      default: "usd",
    },
    status: {
      type: "string",
      label: "Status",
      optional: true,
      options: [
        "active",
        "trialing",
      ],
      default: "active",
    },
    value: {
      propDefinition: [
        profitwell,
        "value",
      ],
    },
    effectiveDate: {
      propDefinition: [
        profitwell,
        "effectiveDate",
      ],
      description: EffectiveDateDescription("the subscription starts"),
    },
  },
  async run({ $ }): Promise<Subscription> {
    const params: CreateSubscriptionParams = {
      $,
      data: {
        effective_date: this.profitwell.getUnixTimestamp(this.effectiveDate),
        email: this.email,
        plan_id: this.planId,
        plan_interval: this.planInterval,
        value: this.value,
        plan_currency: this.planCurrency,
        status: this.status,
        subscription_alias: this.subscriptionAlias,
        user_alias: this.userAlias,
        user_id: this.userId,
      },
    };
    const data: Subscription = await this.profitwell.createSubscription(params);
    const label: string = this.profitwell.getSubscriptionLabel(data);

    $.export("$summary", `Successfully created subscription ${label}`);

    return data;
  },
});
