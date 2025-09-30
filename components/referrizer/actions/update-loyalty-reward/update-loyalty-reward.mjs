import common from "../common/base.mjs";

export default {
  ...common,
  key: "referrizer-update-loyalty-reward",
  name: "Update Loyalty Reward",
  description: "Modify the details or status of an existing loyalty reward in Referrizer. [See the documentation](https://api.referrizer.com/static/docs/index.html#loyalty-rewards-update-a-loyalty-reward)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    loyaltyRewardId: {
      propDefinition: [
        common.props.referrizer,
        "loyaltyRewardId",
      ],
    },
  },
  async run({ $ }) {
    const {
      referrizer,
      loyaltyRewardId,
      quantityTotal,
      quantityPerContact,
      ...data
    } = this;

    const loyaltyReward = await referrizer.getLoyaltyReward({
      $,
      loyaltyRewardId,
    });

    const response = await referrizer.updateLoyaltyReward({
      $,
      loyaltyRewardId,
      data: {
        ...loyaltyReward,
        ...data,
        quantity: {
          total: quantityTotal || loyaltyReward.quantity.total,
          perContact: quantityPerContact || loyaltyReward.quantity.perContact,
        },
      },
    });

    $.export("$summary", `Successfully updated loyalty reward with ID: ${this.loyaltyRewardId}`);
    return response;
  },
};
