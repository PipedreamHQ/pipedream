import referrizer from "../../referrizer.app.mjs";

export default {
  key: "referrizer-list-loyalty-reward-id-options",
  name: "List Loyalty Reward ID Options",
  description: "Retrieves available options for the Loyalty Reward ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    referrizer,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await referrizer.propDefinitions.loyaltyRewardId.options.call(this.referrizer, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
