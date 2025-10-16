import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";
import { UpdateSubscriptionParams } from "../../common/requestParams";
import { Subscription } from "../../common/responseSchemas";
import { EffectiveDateDescription } from "../../common/propDescriptions";

export default defineAction({
  name: "Update Subscription",
  description:
    "Upgrade/downgrade a subscription [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/manually-added-customers/updating-subscriptions/upgrade-downgrade-a-subscription)",
  key: "profitwell-update-subscription",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    profitwell,
    subscriptionIdOrAlias: {
      propDefinition: [
        profitwell,
        "subscriptionIdOrAlias",
      ],
    },
    effectiveDate: {
      propDefinition: [
        profitwell,
        "effectiveDate",
      ],
      description: EffectiveDateDescription("this update takes effect"),
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
    value: {
      propDefinition: [
        profitwell,
        "value",
      ],
    },
  },
  async run({ $ }): Promise<Subscription> {
    const params: UpdateSubscriptionParams = {
      $,
      subscriptionIdOrAlias: this.subscriptionIdOrAlias,
      data: {
        effective_date: this.profitwell.getUnixTimestamp(this.effectiveDate),
        plan_id: this.planId,
        plan_interval: this.planInterval,
        value: this.value,
      },
    };
    const data: Subscription = await this.profitwell.updateSubscription(params);
    const label: string = this.profitwell.getSubscriptionLabel(data);

    $.export("$summary", `Successfully updated subscription ${label}`);

    return data;
  },
});
