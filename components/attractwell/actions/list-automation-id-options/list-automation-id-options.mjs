import attractwell from "../../attractwell.app.mjs";

export default {
  key: "attractwell-list-automation-id-options",
  name: "List Automation ID Options",
  description: "Retrieves available options for the Automation ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    attractwell,
  },
  async run({ $ }) {
    const options = await attractwell.propDefinitions.automationId.options
      .call(this.attractwell);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
