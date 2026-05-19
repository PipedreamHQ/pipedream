import agiled from "../../agiled.app.mjs";

export default {
  key: "agiled-list-designation-id-options",
  name: "List Designation ID Options",
  description: "Retrieves available options for the Designation ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agiled,
  },
  async run({ $ }) {
    const options = await agiled.propDefinitions.designationId.options.call(this.agiled);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
