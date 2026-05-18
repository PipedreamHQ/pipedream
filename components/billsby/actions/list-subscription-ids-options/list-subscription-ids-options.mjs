import billsby from "../../billsby.app.mjs";

export default {
  key: "billsby-list-subscription-ids-options",
  name: "List Subscription IDs Options",
  description: "Retrieves available options for the Subscription IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billsby,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await billsby.propDefinitions.subscriptionIds.options
        .call(this.billsby, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
