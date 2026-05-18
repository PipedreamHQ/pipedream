import billsby from "../../billsby.app.mjs";

export default {
  key: "billsby-list-subscription-ids-options",
  name: "List Subscription IDs Options",
  description: "Retrieves available options for the Subscription IDs field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billsby,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await billsby.propDefinitions.subscriptionIds.options
      .call(this.billsby, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
