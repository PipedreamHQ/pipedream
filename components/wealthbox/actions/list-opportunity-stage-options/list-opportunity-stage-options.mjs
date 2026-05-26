import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-list-opportunity-stage-options",
  name: "List Stage Options",
  description: "Retrieves available options for the Stage field.",
  version: "0.0.1",
  type: "action",
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
