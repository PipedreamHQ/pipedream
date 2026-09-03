import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-list-opportunity-stage-options",
  name: "List Stage Options",
  description: "List the opportunity stages configured in Wealthbox (e.g. `Prospect`, `Proposal`, `Closed Won`) so agents and users can discover valid stage IDs to pass to the Stage prop in **Create Opportunity**. Returns objects with `label` (stage name) and `value` (numeric stage ID). [See the documentation](https://dev.wealthbox.com/#customizable-categories-list-all-members-of-a-customizable-category-get)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wealthbox,
  },
  async run({ $ }) {
    const options = await wealthbox.propDefinitions.opportunityStage.options
      .call(this.wealthbox);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
