import tremendous from "../../tremendous.app.mjs";

export default {
  key: "tremendous-list-funding-source-id-options",
  name: "List Funding Source ID Options",
  description: "Retrieves available options for the Funding Source ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tremendous,
  },
  async run({ $ }) {
    const options = await tremendous.propDefinitions.fundingSourceId.options
      .call(this.tremendous);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
