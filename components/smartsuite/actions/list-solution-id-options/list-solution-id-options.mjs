import smartsuite from "../../smartsuite.app.mjs";

export default {
  key: "smartsuite-list-solution-id-options",
  name: "List Solution ID Options",
  description: "Retrieves available options for the Solution ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsuite,
  },
  async run({ $ }) {
    const options = await smartsuite.propDefinitions.solutionId.options.call(this.smartsuite);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
