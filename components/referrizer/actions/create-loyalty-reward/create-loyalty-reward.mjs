import common from "../common/base.mjs";

export default {
  ...common,
  key: "referrizer-create-loyalty-reward",
  name: "Create Loyalty Reward",
  description: "Adds a new loyalty reward to the Referrizer system. [See the documentation](https://api.referrizer.com/static/docs/index.html#loyalty-rewards-create-a-loyalty-reward)",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const {
      referrizer,
      quantityTotal,
      quantityPerContact,
      ...data
    } = this;

    const response = await referrizer.createLoyaltyReward({
      $,
      data: {
        ...data,
        quantity: {
          total: quantityTotal,
          perContact: quantityPerContact,
        },
      },
    });

    $.export("$summary", `Successfully created loyalty reward with ID: ${response.id}`);
    return response;
  },
};
